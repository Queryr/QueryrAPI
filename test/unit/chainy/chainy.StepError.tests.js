'use strict';

var expect = require( 'expect.js' );

var chainy = require( '../../../src/chainy' );

describe( 'chainy.StepError', function() {
	describe( 'instance', function() {
		it( 'is an instance of Error', function() {
			var stepMock = {
				index: 0,
				error: new Error( 'some error' )
			};
			expect( new chainy.StepError( stepMock ) ).to.be.an( Error );
		} );
	} );
} );