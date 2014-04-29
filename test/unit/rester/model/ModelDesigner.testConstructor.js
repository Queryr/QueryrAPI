'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var types = rester.typeSpeccer.basicTypeSpecs;

describe( 'ModelDesigner constructor', function() {
	var typesArray = _.values( types );

	var workingInstantiation = {
		'one TypeSpec instance': function() {
			return new ModelDesigner( [ typesArray[ 0 ] ] );
		},
		'several TypeSpec instances': function() {
			return new ModelDesigner( typesArray );
		}
	};
	_.each( workingInstantiation, function( instantiation, description ) {
		describe( 'instantiation with ' + description, function() {
			it( 'throws no error', function() {
				expect( instantiation ).to.not.throwError();
			} );
			it( 'should be a ModelDesigner instance', function() {
				expect( instantiation() ).to.be.a( ModelDesigner );
			} );
		} );
	} );

	var failingInstantiations = {
		'no TypeSpec array': function() {
			new ModelDesigner();
		},
		'empty TypeSpec array': function() {
			new ModelDesigner( [] );
		}
	};
	_.each( failingInstantiations, function( instantiation, description ) {
		describe( 'instantiation with ' + description, function() {
			it( 'throws an error', function() {
				expect( instantiation ).to.throwError();
			} );
		} );
	} );
} );
