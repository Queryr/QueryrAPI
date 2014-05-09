'use strict';

var expect = require( 'expect.js' );
var sinon = require( 'sinon' );
var _ = require( 'underscore' );

var chainy = require( '../../../src/chainy' );

//noinspection JSHint
describe( 'chainy()', function() {
	var pieces = {
		obj1: new chainy.ContextChangePiece( {} ),
		obj2: new chainy.ContextChangePiece( {} ),
		memberA: new chainy.ContextMemberPiece( 'a' ),
		memberB: new chainy.ContextMemberPiece( 'b' ),
		callback: ( function() {
			var callbackSpy = sinon.spy( function() {
				return this;
			} );
			var piece = new chainy.CallbackPiece( callbackSpy );
			piece.testSpy = callbackSpy;
			return piece;
		}() )
	};

	describe( 'returned function', function() {
		it( 'is a function', function() {
			expect( chainy( {} ) ).to.be.a( Function );
		} );

		it( 'returns a function again when used to add chain piece', function() {
			expect( chainy( {} )( 'foo' ) ).to.be.a( Function );
		} );
	} );

	describe( '#fromPieces( pieces ) and #pieces()', function() {
		it( 'returns pieces previously set', function() {
			var piecesArray = _.values( pieces );
			var chain = chainy.fromPieces( piecesArray );
			expect( chain.pieces() ).to.eql( piecesArray );
		} );
	} );

	describe( '#on( initialContextPiece )', function() {
		it( 'replaces existing object piece at first position', function() {
			expect(
				chainy.fromPieces( [ pieces.obj1, pieces.memberA ] ).on( pieces.obj2 ).pieces()
			).to.eql(
				[ pieces.obj2, pieces.memberA ]
			);
		} );

		it( 'prepends context to first piece if current first piece no context piece', function() {
			expect(
				chainy.fromPieces( [ pieces.memberA, pieces.memberB ] ).on( pieces.obj1 ).pieces()
			).to.eql(
				[ pieces.obj1, pieces.memberA, pieces.memberB ]
			);
		} );
	} );

	describe( '#on( initialContextObject )', function() {
		it( 'replaces existing object piece at first position', function() {
			var piece = chainy.fromPieces( [ pieces.obj1, pieces.memberA ] ).on( {} ).pieces()[ 0 ];
			expect( piece ).not.to.be( pieces.obj1 );
			expect( piece ).to.be.a( chainy.ContextChangePiece );
		} );

		it( 'prepends context to first piece if current first piece no context piece', function() {
			var piece = chainy.fromPieces( [ pieces.memberA ] ).on( {} ).pieces()[ 0 ];
			expect( piece ).to.be.a( chainy.ContextChangePiece );
		} );
	} );

	describe( '#go( stepsCallback )', function() {
		var objSpy;
		var obj;
		var chain;

		beforeEach( function() {
			objSpy = sinon.spy( function() {
				return this;
			} );
			obj = {
				a: objSpy,
				b: objSpy
			};
			Object.defineProperty( obj, 'c', {
				value: objSpy
			} );
			chain = chainy( 'a' )( 'b' )( 'c' ).on( obj );
		} );

		it( 'returns the chainy object', function() {
			expect( chain.go( function( step ) { step(); } ) ).to.be( chain );
		} );

		it( 'stops if stepsCallback\'s first argument won\'t be called', function() {
			var spy = sinon.spy();
			chain.go( spy );

			expect( spy.callCount ).to.be( 1 );
			expect( objSpy.callCount ).to.be( 0 );
		} );

		it( 'gets called for "ContextMemberPiece" steps', function() {
			var i = 0;
			var spy = sinon.spy( function( step ) {
				expect( step.index ).to.be( i );
				expect( step.memberName ).to.be( [ , 'a', 'b', 'c' ][ i ] );

				var isFirst = false;
				var isLast = false;
				switch( step.memberName ) {
					case 'c':
						isLast = true;
						break;
					case undefined:
						isFirst = true; // first piece is ContextChangePiece
						break;
				}
				expect( step.isFirst ).to.be( isFirst );
				expect( step.isLast ).to.be( isLast );

				i++;
				step();

				// everything after step() will be executed after the entire chain since step()
				// will result into recursive callback calls.
				expect( i ).to.be( 4 );
			} );
			chain.go( spy );

			expect( spy.callCount ).to.be( 4 );
			expect( objSpy.callCount ).to.be( 3 );
		} );

		describe( 'callback\'s "step" function', function() {
			it( 'throws an error if called twice', function() {
				chainy( {} ).go( function( step ) {
					step();
					expect( step ).to.throwError();
				} );
			} );
		} );
	} );

	describe( '#go()', function() {
		it( 'returns the chainy object', function() {
			var chain = chainy( [] );
			expect( chain( 'push', [ 1 ] ).go() ).to.be( chain );
		} );

		it( 'throws error if chain requires member call on non-existent member', function() {
			expect( function() {
				chainy( {} )( 'foo' ).go();
			} ).to.throwError( function( e ) {
				expect( e ).to.be.a( chainy.StepError );
			} );
		} );

		describe( 'on chain with "CallbackPiece" pieces', function() {
			it( 'calls callback once with step argument', function() {
				chainy( {} )( pieces.callback ).go();
				expect( pieces.callback.testSpy.calledOnce ).to.be.ok();
				expect( pieces.callback.testSpy.calledWith( sinon.match.typeOf( 'function' ) ) ).to.be.ok();
			} );

			it(
				'throws an error if callback executes step argument because the callback itself ' +
					'is the step already',
				function() {
					chainy( {} )( function( step ) {
						expect( step ).to.throwError();
					} ).go();
				}
			);
		} );

		var chainPiecesDefinitions = [
			[
				[ 'I' ],
				[ 'go' ],
				[ 'home' ]
			], [
				[ 'I' ],
				[ 'go' ],
				[ 'home', [ 'now' ] ]
			]
		];
		_.each( chainPiecesDefinitions, describeGoOnChainDefinition );
	} );

	function describeGoOnChainDefinition( chainPieces ) {
		var fullChainPath = '';
		var expectFullChainExecution, chain;

		_.each( chainPieces, function( piece ) {
			var name = piece[ 0 ];
			var args = piece[ 1 ] || [];
			fullChainPath += name + '(' + args.join( '.' ) + ').';
		} );

		beforeEach( function() {
			var result = '';
			chain = chainy();

			var obj = {};

			_.each( chainPieces, function( piece ) {
				var name = piece[ 0 ];
				var args = piece[ 1 ] || [];

				obj[ name ] = function() {
					result += name + '(' + Array.prototype.join.call( arguments, '.' ) + ').';
					return this;
				};
				chain.on( obj ).apply( chain, piece );
			} );

			expectFullChainExecution = function() {
				expect( result ).to.be( fullChainPath );
			};
		} );

		it( 'goes ' + fullChainPath, function() {
			chain.go();
			expectFullChainExecution();
		} );

		it( 'goes ' + fullChainPath + ' and calls callback for each step', function() {
			var spy;
			var i = 0;
			chain.go( spy = sinon.spy( function( step ) {
				i++;
				expect( spy.callCount ).to.be( i );

				if( step.piece instanceof chainy.ContextMemberPiece ) {
					var chainPiece = chainPieces[ i - 2 ];
					expect( step.memberName ).to.be( chainPiece	[ 0 ] );
					expect( step.args ).to.eql( chainPiece[ 1 ] || [] );
				}

				step();
			} ) );

			expectFullChainExecution();
		} );

		it( 'does not go ' + fullChainPath + ' when used with callback not invoking the step', function() {
			var spy;
			chain.go( spy = sinon.spy( function( step ) {
				// DO NOT CALL step() FOR THIS TEST
			} ) );
			expect( spy.calledOnce ).to.be( true );
			expect( expectFullChainExecution ).to.throwError();
		} );
	}
} );
