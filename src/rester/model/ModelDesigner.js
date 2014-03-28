"use strict";

var ModelDesign = require( './ModelDesign' );

var Type = require( './Type' );
var Assertion = require( 'typeSpeccer/Assertion' );

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
	var TYPE_NAMES = getTypeNamesFromTypeSpecs( usableFieldTypes );

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

	function declare( word, callback ) {
		// TODO

		var callbackObject = {
			/**
			 * Will add a condition for this function to continue.
			 */
			continueIf: function() {},
			/**
			 * Will add a condition for this function to stop
			 */
			stopIf: function() {},
			startTopic: function() {},
			endTopic: function() {},
			/**
			 * Returns whether a certain word has been called right before the current one.
			 *
			 * @param {string|string[]} word One or more words of whom one is expected to be the
			 *        direct precursor of the current word.
			 */
			comesFrom: function( word ) {}
		};

		// TODO: Return fn with fields instead, see usage below.
		return {
			topic: function() {}
		};
	}

	function declareNode( word, callback ) {
		// TODO
	}

	this.model = function( name ) {
		var modelDesign = new ModelDesign(); // TODO
		models[ name ] = modelDesign;

		setContext( modelDesign );
	};

	var nextFieldName = null;
	declare( 'field', function( fieldName ) {
		this.startTopic();
		nextFieldName = fieldName;
	} );

	declareNode( 'as' ).topic( 'field' )( function() {
		this.continueIf( this.comesFrom( 'field' ) );
	} );
	declareNode( 'as' )( function() {
		this.continueIf( inContext( Type ) );
		this.continueIf( this.comesFrom( 'or' ) );
	} );

	declare( 'or', function() {
		this.continueIf( inContext( Type ) );
		// Allows for defining a mixed type for a field or for joining assertions.
		// TODO: handle assertions "or" in generic way with separate "declare".
	} );

	for( var i in usableFieldTypes ) {
		var typeSpec = usableFieldTypes[ i ];
		var typeName = typeSpec.name();

		declare( typeName ).topic( 'field' )( function() {
			//this.continueIf( nextFieldName !== null );
			// NOTE: Don't need this since this fn will only run if topic is still running.

			var newField = new Type( typeSpec );
			context.setField( nextFieldName, newField );
			nextFieldName = null;
			setContext( newField );

			this.endTopic();
		} );

		declare( typeName, function() {
			this.continueIf( inContext( Type ) );
			this.continueIf( context.getTypeSpec() );

			// TODO: change typeSpec to MixedType
		} );

		typeSpec.validators().each( function( validator, validatorName ) {

			declare( validatorName, function() {
				this.continueIf( inContext( Type ) );
				this.continueIf( context.getTypeSpec() === typeSpec );

				var assertion = new Assertion( validatorName, Assertion.unknown.and( arguments ) );
				context.addAssertion( assertion );

				// TODO: handle properties, e.g. 'length': .with.length.between(...)
			} );

		} );

		declare( 'with', function() {
			this.continueIf( inContext( Type ) );
			this.continueIf( this.comesFrom( TYPE_NAMES ) );
		} );
	}
};

function getTypeNamesFromTypeSpecs( typeSpecs ) {
	var typeNames = [];
	for( var i in typeSpecs ) {
		var typeSpec = typeNames[ i ];
		typeNames.push( typeSpec.name() );
	}
}