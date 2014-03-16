"use strict";

var ModelDesign = require( './ModelDesign' );

var Type = require( './Type' );

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
		// TODO
	}

	function inContext( context ) {
		// TODO
	}

	/**
	 * Defines a function associated with a member if a given context is the current context.
	 *
	 * @param {*} grammarContext
	 * @param {string} word
	 * @param {Function} fn
	 */
	function defineGrammar( grammarContext, word, fn ) {
		var oldFn =  self[ word ] || null;
		// TODO: Think about copying attributes on that fn.
		self[ word ] = function() {
			var ret;
			if( inContext( grammarContext ) ) {
				ret = fn.apply( this, arguments );
			}
			else if( oldFn ) {
				ret = oldFn.apply( this, arguments );
			}
			else {
				throw new Error( 'No meaning associated with "' + word + '" in current context' );
				// TODO: think about moving up in context, e.g. can call "field" from context below model.
			}

			ret = ret !== undefined
				? ret
				: currentGrammarNode || this;

			currentGrammarNode = null;
			return ret;
		};
	}

	/**
	 * Can be used to define a conjunction to be used after a defined word, followed by a set of
	 * other possible words.
	 *
	 * @param {string} word
	 * @param {string[]} followingWords
	 */
	function defineGrammarNode( word, followingWords ) {
		currentGrammarNode = currentGrammarNode || {};
		var node = currentGrammarNode[ word ] = currentGrammarNode[ word ] || {};
		for( var i in followingWords ) {
			var followingWord = followingWords[ i ];
			node[ followingWords[ i ] ] = self[ followingWord ];
		}
		// TODO: also add error throwing functions for words not allowed after the conjunction.
	}

	this.model = function( name ) {
		var modelDesign = new ModelDesign(); // TODO
		models[ name ] = modelDesign;

		setContext( modelDesign );
	};

	var nextFieldName = null;
	defineGrammar( 'model', 'field', function( fieldName ) {
		nextFieldName = fieldName;
		defineGrammarNode( 'as', TYPE_NAMES );
	} );

	defineGrammar( 'or', function() {
		defineGrammarNode( 'as', TYPE_NAMES );
		// TODO: context 2: between assertions
	} );

	for( var i in usableFieldTypes ) {
		var typeSpec = usableFieldTypes[ i ];

		defineGrammar( 'field', typeSpec.name(), function() {
			if( context.getTypeSpec() !== null ) {
				// TODO: change typeSpec to MixedType
			} else {
				var newField = new Type( typeSpec );
				models[ nextFieldName ] = newField;
				nextFieldName = null;
				setContext( newField );
				defineGrammarNode( 'as', TYPE_NAMES );
			}
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