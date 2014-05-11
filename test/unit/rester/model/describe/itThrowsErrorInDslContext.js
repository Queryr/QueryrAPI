'use strict';

module.exports = itThrowsErrorInDslContext;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );
var chain = require( '../../../../../src/chainy' );

function itThrowsErrorInDslContext( dslChain ) {
	var contextPathPieces = dslChain.pieces().slice( 1, -1 );
	var contextPath = _.map( contextPathPieces, function( piece ) {
		if( !( piece instanceof chain.ContextMemberPiece ) ) {
			throw new Error( 'expected a chain of member functions executed on the context object' );
		}
		return '#' + piece.memberName
			+ ( piece.memberCallArgs.length ? '(' + piece.memberCallArgs.length + ' args)' : '' );
	} );
	it( 'throws an error if invoked after ' + contextPath.join( '' ), function() {
		var chainError;

		dslChain.go( function( step ) {
			try {
				if( step.isLast ) {
					expect( step ).to.throwError();
				} else {
					expect( step ).to.not.throwError();
				}
			} catch( error ) {
				chainError = new StepExpectationError( step, error );
			}
		} );
		if( chainError ) {
			throw chainError;
		}
	} );
}

function StepExpectationError( step, error ) {
	Error.call( this );

	this.step = step;
	this.error = error;
	this.message = error.message
		+ ' (step ' + ( step.index + 1 ) + ' of ' + ( -step.indexFromEnd + step.index )
		+ ( step.memberName ? ' on member "' + step.memberName + '")' : ')' );
}
StepExpectationError.prototype = Object.create( Error.prototype );
StepExpectationError.prototype.constructor = StepExpectationError;

