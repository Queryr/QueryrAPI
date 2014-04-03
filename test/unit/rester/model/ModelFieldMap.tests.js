'use strict';

var expect = require( 'expect.js' );

var rester = require( '../../../../' ).rester;
var ModelFieldMap = rester.model.ModelFieldMap;
var ModelField = rester.model.ModelField;
var TypeSpec = rester.typeSpeccer.TypeSpec;

describe( 'modelFieldMap', function() {
	var modelFieldMap;
	var modelField;

	beforeEach( function() {
		modelFieldMap = new ModelFieldMap();
		modelField = new ModelField(
			new TypeSpec( 'SomeType' ), {}
		);
	} );

	it( 'has a length of 0 after construction', function() {
		expect( modelFieldMap.length ).to.be( 0 );
	} );

	describe( '#set( name, modelField )', function() {
		it( 'returns a self-reference', function() {
			expect( modelFieldMap.set( 'foo', modelField ) ).to.be( modelFieldMap );
		} );

		it( 'should increase the "length" property', function() {
			modelFieldMap.set( 'foo', modelField );
			expect( modelFieldMap.length ).to.be( 1 );
		} );

		it( 'allows setting the same modelField under different names', function() {
			modelFieldMap.set( 'foo', modelField );
			modelFieldMap.set( 'bar', modelField );
			expect( modelFieldMap.length ).to.be( 2 );
		} );

		it( 'should not increase the "length" property when overwriting a modelField', function() {
			modelFieldMap.set( 'foo', modelField );
			modelFieldMap.set( 'foo', new ModelField( new TypeSpec( 'AnotherType' ), {} ) );
			expect( modelFieldMap.length ).to.be( 1 );
		} );
	} );

	describe( '#get( name )', function() {
		it( 'returns null if no modelField has been set for given name', function() {
			expect( modelFieldMap.get( 'foo' ) ).to.be( null );
		} );
		
		it( 'returns the modelField instance previously registered under the given name', function() {
			modelFieldMap.set( 'foo', modelField );
			expect( modelFieldMap.get( 'foo' ) ).to.be( modelField );
		} );
	} );

	describe( '#has( name )', function() {
		it( 'return false if modelField is not part of the map', function() {
			expect( modelFieldMap.has( 'foo' ) ).to.be( false );
		} );

		it( 'returns true if modelField is part of the map', function() {
			modelFieldMap.set( 'foo', modelField );
			expect( modelFieldMap.has( 'foo' ) ).to.be( true );
		} );
	} );

	describe( '#copy()', function() {
		it( 'returns a ModelFieldMap instance', function() {
			expect( modelFieldMap.copy() ).to.be.a( ModelFieldMap );
		} );
		it( 'returns a ModelFieldMap of same length as original, containing same fields', function() {
			modelFieldMap.set( 'foo', modelField );
			modelFieldMap.set( 'bar', modelField );

			var copy = modelFieldMap.copy();

			expect( copy.length ).to.be( 2 );
			expect( copy.get( 'foo' ) ).to.be( modelField );
			expect( copy.get( 'bar' ) ).to.be( modelField );
		} );
	} );
} );
