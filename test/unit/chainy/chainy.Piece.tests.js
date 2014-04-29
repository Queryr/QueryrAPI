'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var chainy = require( '../../../src/chainy' );

describe( 'chainy.Piece.extend()', function() {
	var AnotherPiece = chainy.Piece.extend( function() {
		this.decorateStep = function( step ) {
			step.foo = true;
		};
	} );

	it( 'returns a constructor function', function() {
		expect( AnotherPiece ).to.be.a( Function );
	} );

	describe( 'instance of extended constructor', function() {
		it( 'is an instance of chainy.Piece as well as an instance of the used constructor', function() {
			expect( new AnotherPiece() ).to.be.a( chainy.Piece );
			expect( new AnotherPiece() ).to.be.a( AnotherPiece );
		} );

		it( 'has member overwritten via constructor', function() {
			var step = {};
			( new AnotherPiece() ).decorateStep( step );
			expect( step ).to.eql( { foo: true } );
		} );
	} );
} );