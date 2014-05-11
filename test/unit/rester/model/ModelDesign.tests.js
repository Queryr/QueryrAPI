'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelDesign = rester.model.ModelDesign;
var ModelField = rester.model.ModelField;
var ModelFieldMap = rester.model.ModelFieldMap;
var TypeSpec = rester.typeSpeccer.TypeSpec;

var someType = new TypeSpec( 'someType' );

function newInstance( params ) {
	return new ModelField( params[0], params[1], params[2] );
}

describe( 'ModelDesign', function() {
	describe( 'constructor', function() {
		it( 'throws an error if first parameter is not a ModelFieldMap instance', function() {
			expect( function() {
				new ModelDesign( null );
			} ).to.throwError();
		} );
		it( 'can be used without first parameter', function() {
			expect( function() {
				new ModelDesign();
			} ).to.not.throwError();
		} );
		it( 'can be used with first parameter as ModelFieldMap', function() {
			expect( function() {
				new ModelDesign( new ModelFieldMap() );
			} ).to.not.throwError();
		} );
		it( 'creates a copy of the given ModelFieldMap instead of keeping a reference to the original', function() {
			var modelFieldMap = new ModelFieldMap()
				.set( 'foo', new ModelField( someType ) )
			;
			var modelDesign = new ModelDesign( modelFieldMap );

			modelFieldMap.set( 'bar', new ModelField( someType ) );
			expect( modelFieldMap.length ).to.be( 2 );

			expect( modelDesign.fields() ).not.to.be( modelFieldMap );
			expect( modelDesign.fields().length ).to.be( 1 );
		} );
	} );

	var modelDesign;
	var someField = new ModelField( someType );

	beforeEach( function() {
		modelDesign = new ModelDesign();
	} );

	describe( '#fields()', function() {
		it( 'returns a ModelFieldMap instance', function() {
			expect( modelDesign.fields() ).to.be.a( ModelFieldMap );
		} );
		it( 'returns a cop, not a reference to the internal fields instance', function() {
			expect( modelDesign.fields() ).to.not.be( modelDesign.fields() );
		} );
	} );

	describe( '#fields( newFields )', function() {
		itExpectsToReturnNewInstance( 'fields', [ new ModelFieldMap ] );
	} );

	describe( '$field( fieldName, field )', function() {
		itExpectsToReturnNewInstance( 'field', [ 'foo', someField ] );
		
		it( 'adds a new field to the new ModelDesign\'s fields', function() {
			expect( modelDesign.field( 'foo', someField ).fields().length ).to.be( 1 );
		} );
	} );
	
	describe( '#field( fieldName )', function() {
		it( 'returns a field previously set via #field( fieldName, field )', function() {
			expect( modelDesign.field( 'foo', someField ).field( 'foo' ) ).to.be( someField );
		} );
	} );

	function itExpectsToReturnNewInstance( memberFnName, args ) {
		it( 'returns a new ModelDesign instance', function() {
			var newInstance = modelDesign[ memberFnName ].apply( modelDesign, args );
			expect( newInstance ).to.be.a( ModelDesign );
			expect( newInstance ).to.not.be( modelDesign );
		} );
	}
} );
