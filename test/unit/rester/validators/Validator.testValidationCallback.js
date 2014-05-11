'use strict';

var expect = require( 'expect.js' );
var sinon = require( 'sinon' );

var Validator = require( '../../../../' ).rester.validators.Validator;

describe( 'Validator constructor\'s callback ', function() {
	var spy;
	var validator;

	beforeEach( function() {
		spy = sinon.stub().returns( true );
		validator = new Validator( spy, 'to be *' );
	} );

	it( 'should not have been invoked immediately after object creation', function() {
		expect( spy.called ).to.be( false );
	} );

	it( 'should be invoked on #isValid() call', function() {
		validator.isValid( 'foo' );
		expect( spy.called ).to.be( true );
	} );

	it( 'should receive all parameters given to #isValid() call', function() {
		var params = [ 'foo', 1, 2, 3 ];
		validator.isValid.apply( validator, params );
		expect( spy.calledWith.apply( spy, params ) ).to.be( true );
	} );
} );