'use strict';

module.exports = chainy;

var _ = require( 'underscore' );

/**
 * @returns {Function}
 */
function chainy() {
	var chainPieces = [];

	var self = function addToChain( arg1 ) {
		var piece;

		if( arguments.length === 0 ) {
			return self;
		}

		if( arg1 instanceof chainy.Piece ) {
			piece = arg1;
		}
		else if( typeof arg1 === 'string' ) {
			piece = new chainy.ContextMemberPiece( arg1, arguments[ 1 ] );
		}
		else if( _.isFunction( arg1 ) ) {
			piece = new chainy.CallbackPiece( arg1 );
		}
		else if( typeof arg1 === 'object' && arg1 !== null ) {
			piece = new chainy.ContextChangePiece( arg1 );
		}
		else {
			throw new Error( 'can not create a chain piece from the given arguments' );
		}

		chainPieces.push( piece );
		return self;
	};

	_.extend( self, {
		/**
		 * Allows to overwrite or set the initial context object the chain will be executed on when
		 * calling #go().
		 *
		 * @param {Object|chainy.ContextChangePiece} initialContext
		 */
		on: function( initialContext ) {
			var initialPiece = chainPieces[ 0 ];
			var initialContextPiece = initialContext instanceof chainy.ContextChangePiece
				? initialContext
				: new chainy.ContextChangePiece( initialContext );

			if( initialPiece instanceof chainy.ContextChangePiece ) {
				chainPieces[ 0 ] = initialContextPiece;
			} else {
				chainPieces.unshift( initialContextPiece );
			}
			return this;
		},
		/**
		 * Executes the chain previously defined.
		 *
		 * @param {Function} [stepCallback] Optional function which will be called instead of
		 *        each step originally defined. Instead, the actual step will be supplied in
		 *        form of a function as the first argument of the given stepCallback.
		 * @returns {Function}
		 */
		go: function( stepCallback ) {
			goStep( 0, undefined, stepCallback );
			return self;
		},
		/**
		 * Returns the pieces of the chain.
		 *
		 * @returns {chainy.Piece[]}
		 */
		pieces: function() {
			return chainPieces.slice();
		}
	} );

	return self.apply( self, arguments );

	function goStep( i, stepInput, stepsCallback ) {
		if( i >= chainPieces.length ) {
			return;
		}

		var stepFnObj = buildStepFnObj( i, stepInput, function done( step ) {
			goStep( i + 1, step.returnValue, stepsCallback );
		} );

		if( stepsCallback ) {
			stepsCallback( stepFnObj );
		} else {
			stepFnObj();
		}
	}

	function buildStepFnObj( i, stepContext, doneFn ) {
		var chainPiece = chainPieces[ i ];

		var step = function step() {
			if( step.returnValue || step.error ) {
				throw new Error(
					'the chain\'s step with index ' + i + ' has already been executed' );
			}

			try {
				step.returnValue = chainPiece.step( step );
			} catch( error ) {
				step.error = error;
				throw new StepError( step );
			}

			doneFn( step );
		};
		_.extend( step, {
			piece: chainPiece,
			isLast: i === chainPieces.length - 1,
			isFirst: i === 0,
			index: i,
			context: stepContext,
			returnValue: undefined,
			error: undefined
		} );

		chainPiece.decorateStep( step );

		return step;
	}
}

chainy.fromArray = chainy.fromPieces = function( pieces ) {
	var chain = chainy();
	for( var i = 0; i < pieces.length; i++ ) {
		var piece = pieces[ i ];
		chain = piece instanceof chainy.Piece
			? chain( piece )
			: chain.apply( chain, piece );
	}
	return chain;
};

chainy.Piece = function Piece() {};
chainy.Piece.prototype = {
	constructor: chainy.Piece,
	step: function( step ) {
		return step.input;
	},
	decorateStep: function( step ) {
		return;
	}
};

chainy.Piece.extend = function( constructor ) {
	constructor.prototype = new chainy.Piece();
	constructor.prototype.constructor = constructor;
	return constructor;
};

chainy.ContextMemberPiece = chainy.Piece.extend( function ContextMemberPiece( memberName, args ) {
	if( typeof memberName !== 'string' ) {
		throw new Error( 'member name has to be a string' );
	}
	args = args === undefined ? [] : args;
	if( !_.isArray( args ) ) {
		throw new Error( 'arguments for member function have to be given as array');
	}

	this.step = function( step ) {
		var input = step.context;
		if( input === undefined ) {
			throw new Error( 'Can not call function "' + memberName + '" on undefined. '
				+ 'Define the chain\'s initial input first.' );
		}
		if( !_.isFunction( input[ step.memberName ] ) ) {
			throw new Error( 'current context object has no member function "'
				+ step.memberName + '"');
		}
		return input[ step.memberName ].apply( input, step.args );
	};

	this.decorateStep = function( step ) {
		step.args = args;
		step.memberName = memberName;
	};

	this.memberName = memberName;
	this.memberCallArgs = args;
} );

chainy.ContextChangePiece = chainy.Piece.extend( function ContextChangePiece( contextObject ) {
	if( typeof contextObject !== 'object' || contextObject === null ) {
		throw new Error( 'only objects can be set as context' );
	}

	this.step = function( step ) {
		return contextObject;
	};
} );

chainy.CallbackPiece = chainy.Piece.extend( function CallbackPiece( callback ) {
	if( !_.isFunction( callback ) ) {
		throw new Error( 'no callback function given' );
	}

	this.step = function( step ) {
		return callback.call( step.context || null, step.args );
	};
	this.decorateStep = function( step ) {
		step.args = [ step ];
	};
} );

/**
 * Error indicating that a chain's execution step can not be finished due to an error.
 * See {StepError}.step.error for the original error object.
 *
 * @extends {Error}
 *
 * @param {Object} step
 */
var StepError = chainy.StepError = function StepError( step ) {
	Error.call( this );
	this.step = step; // step.error will hold further information.
	this.message = 'step with index ' + step.index + ' can not be executed; ' + step.error.message;
};
StepError.prototype = Object.create( Error.prototype );
StepError.prototype.constructor = StepError;
