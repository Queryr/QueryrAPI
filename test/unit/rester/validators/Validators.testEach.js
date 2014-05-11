'use strict';

var expect = require( 'expect.js' );
var sinon = require( 'sinon' );

var Validators = require( '../../../../' ).rester.validators.Validators;
var Validator = require( '../../../../' ).rester.validators.Validator;

describe( 'Validators', function() {
	var validators;

	beforeEach( function() {
		validators = new Validators();
	} );

	describe( '#each( callback )', function() {
		describeEachWithContext( {
			contextParam: undefined,
			expectedContext: null
		} );
	} );

	describe( '#each( callback, context )', function() {
		var someObject = {};
		describeEachWithContext( {
			contextParam: someObject,
			expectedContext: someObject
		} );
	} );

	function describeEachWithContext( config ) {
		it( 'calls callback( validator, name ) for each Validator instance', function() {
			var instances = [
				new Validator( function() { return true; }, 'to be anything' ),
				new Validator( function() { return true; }, 'to be *' ),
				new Validator( function( value ) { return !!value; }, 'to be truthy' ),
			];

			for( var i = 0; i < instances.length ; i++ ) {
				validators.set( 'validator' + ( i+1 ), instances[ i ] );
			}

			var j = 0;
			var instancesIteratedOver = [];
			validators.each( function( validator, name ) {
				j++;
				expect( name ).to.be( 'validator' + j );
				instancesIteratedOver.push( validator );
			}, config.contextParam );

			expect( j ).to.be( 3 );
			expect( instancesIteratedOver ).to.eql( instances );
		} );

		it( 'invokes callback with "' + config.expectedContext + '" as context', function() {
			var spy = sinon.spy();

			validators.set( 'foo', new Validator( function() { return true; }, 'to be *' ) );
			validators.each( spy, config.contextParam );

			expect( spy.calledOn( config.expectedContext ) ).to.be( true );
		} );
	}
} );
