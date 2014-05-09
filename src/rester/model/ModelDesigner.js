"use strict";

var _ = require( 'underscore' );

var ModelDesign = require( './ModelDesign' );
var ModelField = require( './ModelField' );

var Assertion = require( '../assert/Assertion' );
var TypeSpec = require( '../typeSpeccer/TypeSpec' );

var mixedType = require( '../typeSpeccer/basicTypeSpecs' ).mixed;
var referenceType = require( './referenceTypeSpec' );

var INTERNAL_ABORT = {};

// TODO: Separate actual grammar definition rules, context manager and possibly other generic code
//  for building DSLs from actual ModelDesigner.

// TODO: Think about implementing this as action/event recorder where we still use the functions for
//  defining the grammar in here but using action objects for better structuring the code of how to
//  build the model definition.
// Also see https://speakerdeck.com/mathiasverraes/practical-event-sourcing

/**
 * Allows to describe models. Knows about the different pieces (field types) that can be used to
 * design a model definition.
 *
 * @param {TypeSpec[]} usableFieldTypes The field types that can be used for describing model
 *        fields when describing models with this ModelDesigner.
 *
 * @constructor
 */
module.exports = function ModelDesigner( usableFieldTypes ) {
	usableFieldTypes = ( usableFieldTypes || [] ).concat( [ referenceType ] );

	if( !_.isArray( usableFieldTypes ) ) {
		throw new Error( 'array of TypeSpec instances or undefined expected' );
	}
	var TYPE_NAMES = _.map( _.unique( usableFieldTypes ), function( typeSpec ) {
		if( !( typeSpec instanceof TypeSpec ) ) {
			throw new Error( 'TypeSpec instance expected, ' + typeSpec + ' given' );
		}
		return typeSpec.name();
	} );

	var self = this;
	var models = {};

	var context = [];
	function enterContext( newContext ) {
		context.push( newContext );
	}
	function updateContext( newContext ) {
		if( context.length === 0 ) {
			throw new Error( 'no context set which could be updated' );
		}
		context[ context.length - 1 ] = newContext;
	}
	function replaceContext( oldContext, newContext ) {
		var index = context.indexOf( oldContext );
		if( index !== -1 ) {
			context[ index ] = newContext;
			return true;
		}
		return false;
	}
	function backIntoContext( contextObj ) {
		for( var i = context.length - 1; i >= 0; i-- ) {
			if( context[ i ] === contextObj ) {
				context = context.slice( 0, i + 1 );
				return;
			}
		}
		throw new Error( 'not within given context' );
	}
	function backIntoContextOf( contextConstructor ) {
		for( var i = context.length - 1; i >= 0; i-- ) {
			if( context[ i ] instanceof contextConstructor ) {
				context = context.slice( 0, i + 1 );
				return;
			}
		}
		throw new Error( 'not within context of given type' );
	}
	function inContext( expectedContext ) {
		return getContext() === expectedContext;
	}
	function inContextOf( contextConstructor ) {
		return getContext() instanceof contextConstructor;
	}
	function withinContext( expectedContext ) {
		return !_.every( context, function( value ) {
			return value !== expectedContext;
		} );
	}
	function withinContextOf( expectedContext ) {
		return !_.every( context, function( value ) {
			return !( value instanceof expectedContext );
		} );
	}
	function getContext() {
		return context[ context.length - 1 ];
	}
	function getPreviousContext() {
		return context[ context.length - 2 ];
	}

	var sentence = [];
	function getLastWord() {
		return sentence[ sentence.length - 2 ];
	}
	function getCurrentWord() {
		return sentence[ sentence.length - 1 ];
	}
	var currentTopic = '';
	var currentTopicStopper = [];
	var callbacksWordTopic = {}; // *[ word ][ topic ]

	function declare( word, callback ) {
		var _topic = '';
		var _asFunction = false;

		var ret = function( callback ) {
			var callbacksTopic = callbacksWordTopic[ word ] = callbacksWordTopic[ word ] || {};
			var callbacks = callbacksTopic[ _topic ] = callbacksTopic[ _topic ] || [];
			callbacks.push( callback );

			_defineMember( word, _asFunction || callback.length > 0 );
			return callback;
		};
		ret.topic = function( topic ) {
			_topic = topic;
			return ret;
		};
		ret.function = function( callback ) {
			_asFunction = true;
			return callback ? ret( callback ) : ret;
		};
		ret.as = ret.with = ret;

		return callback ? ret( callback ) : ret;
	}

	function _defineMember( word, asFunction ) {
		var currentMemberProperty = Object.getOwnPropertyDescriptor( self, word );
		var memberProperty = {
			configurable: true // allows us to redefine the property later via Object.defineProperty
		};
		if( currentMemberProperty ) {
			if( !asFunction || currentMemberProperty.value ) {
				// If member defined already and this one doesn't require it as a function, then
				// use whatever is defined, function or getter.
				// This means if any definition requires the word to be a function but another
				// definition only requires a getter, it will be a function in the end and can only
				// be used as such.
				return;
			}
			memberProperty.value = currentMemberProperty.get;
		}
		else if( asFunction ) {
			memberProperty.value = newMember( word );
		}
		else {
			memberProperty.get = newMember( word );
		}
		Object.defineProperty( self, word, memberProperty );
	}

	function newMember( word ) {
		return function() {
			if( typeof word !== 'string' ) {
				throw new Error( 'expected a string as word' );
			}
			var originalArgs = arguments;
			var ret;
			var foundCallback = false;

			sentence.push( word );

			var callbacks = callbacksWordTopic[ word ][ currentTopic ];
			if( !callbacks ) {
				throw new Error( 'no meanings for word "' + word + '" within current topic "' + currentTopic + '"' );
			}
			_.each( callbacks, function( callback, i ) {
				if( foundCallback ) { return; } // TODO: really wanna stop here?
				try {
					ret = callback.apply( callbackObject, originalArgs );
					foundCallback = true;
				} catch( error ) {
					if( error === INTERNAL_ABORT ) {
						return; // not right version of the word in this situation, try next...
					}
					throw error;
				}
			} );
			if( !foundCallback ) {
				var totalMeanings = _.flatten( callbacksWordTopic[ word ] ).length;
				throw new Error( '"' + word + '" has no meaning in current context '
					+ sentence.slice( 0, -1 ).join( '.' ) + ' (' + callbacks.length
					+ ( currentTopic
						? ' meanings within current topic "' + currentTopic + '", '
						: ' meanings outside of any topic, '
					) + totalMeanings + ' meanings in total)' );
			}

			if( currentTopicStopper.length > 0 ) {
				_.each( currentTopicStopper, function( stopperFn ) {
					if( stopperFn() !== false ) {
						currentTopicStopper = _.without( currentTopicStopper, stopperFn );
					}
				} );
				if( currentTopicStopper.length === 0 ) {
					callbackObject.endTopic();
				}
			}

			if( ret !== undefined ) {
				return ret;
			}
			return self;
		};
	}

	var callbackObject = {
		/**
		 * Will add a condition for this function to continue.
		 */
		continueIf: function( conditionResult ) {
			if( !conditionResult ) {
				throw INTERNAL_ABORT;
			}
			return this;
		},
		/**
		 * Will add a condition for this function to stop.
		 */
		stopIf: function( conditionResult ) {
			this.continueIf( !conditionResult );
			return this;
		},
		startTopic: function( topic ) {
			currentTopic = topic !== undefined ? topic : getCurrentWord();
			return this;
		},
		endTopic: function() {
			currentTopic = '';
			currentTopicStopper = [];
			return this;
		},
		keepTopicUntil: function( fn ) {
			currentTopicStopper.push( fn );
			return this;
		},
		/**
		 * Returns whether one or more certain words have been called right before the current one.
		 *
		 * @param {string} lastFewWords One or more words separated by '.'
		 */
		comesFrom: function( lastFewWords ) {
			var words = lastFewWords.split( '.' );
			var lastWords = sentence.slice( -words.length - 1, -1 );
			return lastFewWords === lastWords.join( '.' );
		}
	};

	var currentModel;
	var updateModel;
	/**
	 * The field last added. Can be a single field or a field within a mixed field. If the latter,
	 * then currentMixedField will be set to the mixed field.
	 *
	 * @type ModelField
	 */
	var currentField;
	var currentMixedField;
	/**
	 * Function for replacing the currentField within currentModel. Will affect several "current"
	 * variables.
	 *
	 * @type Function
	 * @param {ModelField} newField
	 */
	var updateCurrentField;

	function resetDesignState() {
		context = [];
		sentence = [];
		updateCurrentField = currentMixedField = currentField = currentModel = updateModel
			= undefined;
	}

	/**
	 * Defines a new ModelDesign instance and stores it under the given name (optional).
	 * If no name is given, the ModelDesign instance can be received by #design().
	 *
	 * @param {string} [name]
	 * @param {ModelDesign} [baseModel] Can be used to define a model based on a given ModelDesign.
	 */
	this.model = function( name, baseModel ) {
		if( baseModel === undefined && typeof name !== 'string' ) {
			baseModel = name;
			name = undefined;
		}
		if( baseModel !== undefined ) {
			if( !( baseModel instanceof ModelDesign ) ) {
				throw new Error( 'expect baseModel to be a ModelDesign instance' );
			}
		} else {
			baseModel = new ModelDesign();
		}

		resetDesignState();

		updateModel = function( model ) {
			if( name !== undefined ) {
				models[ name ] = model;
			}
			replaceContext( currentModel, model );
			currentModel = model;
		};
		sentence.push( 'model' );
		enterContext( baseModel );
		updateModel( baseModel );

		return this;
	};

	/**
	 * Returns the ModelDesign instance being currently designed by a previous #model() invocation.
	 * Useful if #model() has been called without a name for creating a template.
	 */
	this.design = function() {
		if( !currentModel ) {
			throw new Error( 'no model is currently being designed' );
		}
		if( currentTopic ) {
			throw new Error(
				'can not receive model while in the middle of "' + currentTopic + '" declaration' );
		}
		return currentModel;
	};

	/**
	 * Returns all model designs previously designed via #model().
	 *
	 * @returns {Object} field names are each ModelDesign's respective name.
	 */
	this.models = function() {
		return _.extend( {}, models );
	};

	var currentFieldName;
	var subFieldType;
	var subFieldDescriptors;

	// model()."field( '...' )"
	declare( 'field' )( function( fieldName ) {
		this.startTopic();
		if( !inContextOf( ModelDesign ) ) {
			backIntoContextOf( ModelDesign );
		}
		currentFieldName = fieldName;
	} );

	// .field( '...' )."as".type:
	declare( 'as' ).with.topic( 'field' )( function() {
		this.continueIf( this.comesFrom( 'field' ) );
	} );

	// .type1.[...].or."as".type2:
	declare( 'as' )( function() {
		this.continueIf( withinContextOf( ModelField ) );
		this.continueIf( this.comesFrom( 'or' ) );
	} );

	// .type1.[...]."or".as.type2:
	declare( 'or' )( function() {
		this.continueIf( inContextOf( ModelField ) );
	} );

	_.each( usableFieldTypes, function( typeSpec ) {
		var typeName = typeSpec.name();

		// .field( '...' ).as."type":
		declare( typeName ).with.topic( 'field' )( function() {
			subFieldType = typeSpec;
			subFieldDescriptors = {};

			this.keepTopicUntil( function() {
				var newField  = tryToBuildSubField();
				if( !newField ) {
					return false;
				}
				updateCurrentField = updateOuterField;
				currentMixedField = undefined;
				currentField = newField;
				enterContext( newField );
				updateCurrentField( newField );
			} );
		} );

		// .type1.[...].or.as."type2" => mixed type (type1 & type2):
		declare( typeName )( function() {
			this.continueIf( withinContextOf( ModelField ) );
			this.continueIf( this.comesFrom( 'or.as' ) );

			this.startTopic( 'field' );
			backIntoContextOf( ModelField );

			subFieldType = typeSpec;
			subFieldDescriptors = {};

			this.keepTopicUntil( function() {
				var newField = tryToBuildSubField();
				if( !newField ) {
					return false;
				}
				if( !currentMixedField ) {
					newMixedFieldFromCurrentFieldAndNewField( newField );
				} else {
					addFieldToCurrentMixedField( newField );
				}
			} );
		} );

		_.each( typeSpec.descriptors(), function( descriptor, descriptorName ) {
			// .type."descriptor1( value )"[ ."descriptorN( value )" ... ]
			declare( descriptorName ).with.topic( 'field' )( function( descriptorValue ) {
				this.continueIf( subFieldType === typeSpec );
				subFieldDescriptors[ descriptorName ] = descriptorValue;
			} );

			// .type."optionalDescriptor1( value )"[ ."optionalDescriptorN( value )" ... ]
			declare( descriptorName )( function( descriptorValue ) {
				this.continueIf( subFieldType === typeSpec );
				// TODO: this.continueIf( Comes from typeSpec word or another descriptor of same type. )
				subFieldDescriptors[ descriptorName ] = descriptorValue;

				this.startTopic( 'field' ).keepTopicUntil( function() {
					var updatedField = tryToBuildSubField();
					if( !updatedField ) {
						// might happen if one descriptor is optional but only goes together with
						// a 2nd descriptor which has not been set yet
						return false;
					}
					updateCurrentField( updatedField );
				} );
			} );
		} );

		typeSpec.validators().each( function( validator, validatorName ) {
			if( [ 'or', 'and' ].indexOf( validatorName ) !== -1 ) {
				// TODO: filter all logic validators in a nicer way
				return;
			}

			// .type."validator( *arg )"[ .or ]."validator( *arg )"[ ... ]
			declare( validatorName ).as.function( function() {
				this.continueIf( inContextOf( ModelField ) );
				this.continueIf( getContext().type() === typeSpec );

				var currentAssertion = getContext().assertion();
				var assertion = new Assertion( validatorName, Assertion.unknown.and( arguments ) );

				if( this.comesFrom( 'or' ) ) {
					this.continueIf( currentAssertion );

					assertion = logicalAssertion( currentAssertion, 'or', assertion );
				}
				else if( currentAssertion ) {
					if( currentAssertion.getType() === 'or' ) {
						assertion = nestedLogicalAssertion( currentAssertion, 'and', assertion );
					} else {
						assertion = logicalAssertion( currentAssertion, 'and', assertion );
					}
				}
				var updatedField = getContext().assertion( assertion );
				updateCurrentField( updatedField );
				// TODO: handle properties, e.g. 'length': .with.length.between(...)
			} );
		} );

//		declare( 'with' )( function() {
//			this.continueIf( inContextOf( ModelField ) );
//			this.continueIf( this.comesFrom( TYPE_NAMES ) );
//		} );
	} );

	function updateOuterField( newField ) {
		updateModel(
			currentModel.field( currentFieldName, newField )
		);
		if( !replaceContext( currentMixedField || currentField, newField ) ) {
			throw new Error( 'can not update field in current context' );
		}
		if( currentMixedField ) {
			currentMixedField = newField;
		} else {
			currentField = newField;
		}
	}

	function updateMixedFieldsMemberField( newField ) {
		var mixedFieldRestrictions = currentMixedField.descriptors().restrictedTo;
		mixedFieldRestrictions[
			mixedFieldRestrictions.indexOf( currentField )
		] = newField;

		var newMixedField = new ModelField( mixedType, {
			restrictedTo: mixedFieldRestrictions
		} );

		updateModel(
			currentModel.field( currentFieldName, newMixedField )
		);
		if( !replaceContext( currentMixedField, newMixedField )
			|| !replaceContext( currentField, newField )
		) {
			throw new Error( 'can not update field in current context' );
		}
		currentMixedField = newMixedField;
		currentField = newField;
	}

	function newMixedFieldFromCurrentFieldAndNewField( newField ) {
		var mixedField = new ModelField( mixedType, {
			restrictedTo: [
				currentField,
				newField
			]
		} );
		updateOuterField( mixedField );
		updateContext( mixedField );
		enterContext( newField );
		currentMixedField = mixedField;
		currentField = newField;

		updateCurrentField = updateMixedFieldsMemberField;
		updateCurrentField( newField );
	}

	function addFieldToCurrentMixedField( newField ) {
		var mixedFieldRestrictions = currentMixedField.descriptors().restrictedTo;
		mixedFieldRestrictions.push( newField );

		var newMixedField = new ModelField( mixedType, {
			restrictedTo: mixedFieldRestrictions
		} );

		updateOuterField( newMixedField );
		currentField = newField;
	}

	function tryToBuildSubField() {
		try{
			return new ModelField( subFieldType, subFieldDescriptors );
		} catch( e ) {
			return false;
		}
	}
};

function logicalAssertion( logicalOrSingleAssertion, type, newMember ) {
	return logicalOrSingleAssertion.getType() !== type
		? new Assertion( type, [ logicalOrSingleAssertion, newMember ] )
		: assertionDescriptorsPush( logicalOrSingleAssertion, newMember );
}

function nestedLogicalAssertion( aLogicalAssertion, innerAssertionType, newInnerAssertionMember ) {
	var firstInnerAssertionMember = aLogicalAssertion.getDescriptors().pop();
	var newFirstInnerAssertionMember = logicalAssertion(
		firstInnerAssertionMember,
		innerAssertionType,
		newInnerAssertionMember
	);
	return new Assertion(
		aLogicalAssertion.getType(),
		aLogicalAssertion.getDescriptors().slice( 0, -1 ).concat( [ newFirstInnerAssertionMember ] )
	);
}

function assertionDescriptorsPush( assertion, descriptor ) {
	return new Assertion(
		assertion.getType(), assertion.getDescriptors().concat( [ descriptor ] )
	);
}
