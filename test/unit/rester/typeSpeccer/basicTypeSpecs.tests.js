'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var TypeSpec = rester.typeSpeccer.TypeSpec;

var basicTypeSpecs = rester.typeSpeccer.basicTypeSpecs;

var BASIC_TYPES = [ // TODO: Complete list.
	'number',
	'boolean',
	'string',
	'mixed'
];

describe( 'basicTypeSpecs', function() {
	it( 'should have ' + BASIC_TYPES.length + ' different basic type specs', function() {
		expect( _.values( basicTypeSpecs ).length ).to.be( BASIC_TYPES.length );
	} );

	_.each( BASIC_TYPES, function( typeName ) {
		describe( '.' + typeName, function() {
			var typeSpec = basicTypeSpecs[ typeName ];

			it( 'should be a TypeSpec instance', function() {
				expect( typeSpec ).to.be.a( TypeSpec );
			} );

			itShouldHaveValidatorsSet( typeSpec, 'basic validators', [ 'equal', 'ok' ] );
			itShouldHaveValidatorsSet( typeSpec, 'logic validators', [ 'not', 'and'  ] );
		} );
	} );
} );

function itShouldHaveValidatorsSet( itObj, name, validatorSetMemberNames ) {
	_.each( validatorSetMemberNames, function( validatorSetMemberName ) {
		it( 'should have ' + name + ' "' + validatorSetMemberName + '"', function() {
			expect( itObj.validators().has( validatorSetMemberName ) ).to.be( true );
		} );
	} );
}