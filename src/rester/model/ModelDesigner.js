"use strict";

var _ = require( 'underscore' );

var ModelDesign = require( './ModelDesign' );

var ModelField = require( './ModelField' );
var Assertion = require( '../assert/Assertion' );
var TypeSpec = require( '../typeSpeccer/TypeSpec' );

var mixedType = require( '../typeSpeccer/basicTypeSpecs' ).mixed;

var INTERNAL_ABORT = {};

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
	var TYPE_NAMES = _.map( usableFieldTypes || [], function( typeSpec ) {
		if( !( typeSpec instanceof TypeSpec ) ) {
			throw new Error( 'TypeSpec instance expected, other value given' );
		}
		return typeSpec.name();
	} );
	if( TYPE_NAMES.length < 1 ) {
		throw new Error( 'ModelDesigner expects at least one TypeSpec for designing fields' );
	}

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
		}
	}
	function backIntoContextOf( contextConstructor ) {
		for( var i = context.length - 1; i >= 0; i-- ) {
			if( context[ i ] instanceof contextConstructor ) {
				context = context.slice( 0, i + 1 );
				return;
			}
		}
		throw new Error( 'not within given context' );
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

	var sentence = [];
	function getLastWord() {
		return sentence[ sentence.length - 2 ];
	}
	function getCurrentWord() {
		return sentence[ sentence.length -1 ];
	}
	var currentTopic = '';
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

			_.each( callbacksWordTopic[ word ][ currentTopic ], function( callback, i ) {
				try {
					ret = callback.apply( callbackObject, originalArgs );
					foundCallback = true;
					return false;
				} catch( error ) {
					if( error === INTERNAL_ABORT ) {
						return; // not right version of the word in this situation, try next...
					}
					throw error;
				}
			} );
			if( !foundCallback ) {
				throw new Error( '"' + word + '" has no meaning in current context ('
					+ sentence.join( ' ' ) + ')' );
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
		},
		/**
		 * Will add a condition for this function to stop.
		 */
		stopIf: function( conditionResult ) {
			this.continueIf( !conditionResult );
		},
		startTopic: function() {
			currentTopic = getCurrentWord();
		},
		endTopic: function() {
			currentTopic = '';
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
	 * Defines a new ModelDesign instance and stores it under the given name (optional).
	 * If no name is given, the ModelDesign instance can be received by #designTemplate().
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

	// model()."field"( '...' )
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
		this.continueIf( inContextOf( ModelField ) );
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
			var newField = new ModelField( typeSpec );

			updateModel(
				getContext().field( currentFieldName, newField )
			);
			enterContext( newField );

			this.endTopic();
		} );

		// .type1.[...].or.as."type2" => mixed type:
		declare( typeName )( function() {
			this.continueIf( inContextOf( ModelField ) );
			this.continueIf( this.comesFrom( 'or.as' ) )

			var otherField = getContext();
			var newField = new ModelField( typeSpec );

			var mixedField = new ModelField( mixedType, {
				restrictedTo: [
					otherField,
					newField
				]
			} );
			updateModel(
				currentModel.field( currentFieldName, mixedField )
			);
			updateContext( mixedField );
		} );

// TODO: logical validators should be out of this so they won't be created as functions but instead
//       as getters. Without this distinction, or() will conflict with other context or usage above.
/*		typeSpec.validators().each( function( validator, validatorName ) {
			declare( validatorName ).as.function( function() {
				this.continueIf( inContextOf( ModelField ) );
				this.continueIf( getContext().typeSpec() === typeSpec );

				var assertion = new Assertion( validatorName, Assertion.unknown.and( arguments ) );
				getContext().addAssertion( assertion );

				// TODO: handle properties, e.g. 'length': .with.length.between(...)
			} );
		} );*/

		declare( 'with' )( function() {
			this.continueIf( inContextOf( ModelField ) );
			this.continueIf( this.comesFrom( TYPE_NAMES ) );
		} );
	} );
};
