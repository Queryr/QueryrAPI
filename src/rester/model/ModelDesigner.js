"use strict";

var _ = require( 'underscore' );

var ModelDesign = require( './ModelDesign' );

var ModelField = require( './ModelField' );
var Assertion = require( '../assert/Assertion' );
var TypeSpec = require( '../typeSpeccer/TypeSpec' );

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

	var context = null;
	var currentGrammarNode = null;

	function setContext( newContext ) {
		context = newContext;
	}

	function inContext( context ) {
		// TODO
	}

	var sentence = [];
	function getLastWord() {
		return sentence[ sentence.length - 2 ] || null;
	}
	function getCurrentWord() {
		return sentence[ sentence.length -1 ] || null;
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
		};
		ret.topic = function( topic ) {
			_topic = topic;
			return ret;
		};
		ret.function = function( fn ) {
			_asFunction = true;
			if( fn ) {
				ret( fn );
			} else {
				return ret;
			}
			return fn ? ret( fn ) : ret;
		};
		ret.as = ret.with = ret;

		if( callback ) {
			return ret( callback );
		}
		return ret;
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
		 * Returns whether a certain word has been called right before the current one.
		 *
		 * @param {string|string[]} word One or more words of whom one is expected to be the
		 *        direct precursor of the current word.
		 */
		comesFrom: function( word ) {
			return word === getLastWord();
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
			currentModel = model;
		};
		updateModel( baseModel );

		sentence.push( 'model' );
		setContext( baseModel );
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

	var nextFieldName = null;
	declare( 'field', function( fieldName ) {
		this.startTopic();
		nextFieldName = fieldName;
	} );

	declare( 'as' ).with.topic( 'field' )( function() {
		this.continueIf( this.comesFrom( 'field' ) );
	} );

	declare( 'as' )( function() {
		this.continueIf( inContext( ModelField ) );
		this.continueIf( this.comesFrom( 'or' ) );
	} );

	declare( 'or', function() {
		this.continueIf( inContext( ModelField ) );
		// Allows for defining a mixed type for a field or for joining assertions.
		// TODO: handle assertions "or" in generic way with separate "declare".
	} );

	_.each( usableFieldTypes, function( typeSpec ) {
		var typeName = typeSpec.name();

		declare( typeName ).with.topic( 'field' )( function() {
			//this.continueIf( nextFieldName !== null );
			// NOTE: Don't need this since this fn will only run if topic is still running.

			var newField = new ModelField( typeSpec );
			updateModel(
				context = context.field( nextFieldName, newField )
			);
			nextFieldName = null;
			setContext( newField );

			this.endTopic();
		} );

		declare( typeName, function() {
			this.continueIf( inContext( ModelField ) );
			this.continueIf( context.getTypeSpec() );

			// TODO: change typeSpec to MixedType
		} );

		typeSpec.validators().each( function( validator, validatorName ) {
			declare( validatorName ).as.function( function() {
				this.continueIf( inContext( ModelField ) );
				this.continueIf( context.getTypeSpec() === typeSpec );

				var assertion = new Assertion( validatorName, Assertion.unknown.and( arguments ) );
				context.addAssertion( assertion );

				// TODO: handle properties, e.g. 'length': .with.length.between(...)
			} );
		} );

		declare( 'with' )( function() {
			this.continueIf( inContext( ModelField ) );
			this.continueIf( this.comesFrom( TYPE_NAMES ) );
		} );
	} );
};
