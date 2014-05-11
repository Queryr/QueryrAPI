'use strict';

var _ = require( 'underscore' );

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

describe( 'number TypeSpec instance', function() {

	var evenNumbers = [ 2, 4, 6, 8, 42, 1000, -998, 0 ];
	var oddNumbers = [ 1, 3, 0.1, 0.2, 0.5, -1, -999 ];

	var smallAndBigNumbers = [
		[ 0, 1 ],
		[ -1, 0 ],
		[ 0, 9999 ],
		[ -9999, -42 ],
		[ 0.42, 1.337 ],
		[ 0, Infinity ],
		[ -Infinity, 0 ],
		[ -Infinity, Infinity ],
	];
	var bigAndSmallNumbers = _.map( smallAndBigNumbers, function( pair ) {
		return [ pair[1], pair[0] ];
	} );
	bigAndSmallNumbers.andNaNs =
	smallAndBigNumbers.andNaNs =
		function() {
			return this.concat( [
				[ NaN, 0 ],
				[ 0, NaN ],
				[ NaN, NaN ]
			] );
		};

	describeTypeSpecCreator( 'number', {
		valid: evenNumbers.concat( oddNumbers ),
		invalid: [ 'foo', /./, {}, [], new Date(), null, false, true, undefined ],
		validators: {
			even: {
				valid: evenNumbers,
				invalid: oddNumbers
			},
			odd: {
				valid: oddNumbers,
				invalid: evenNumbers
			},
			below: {
				valid: smallAndBigNumbers,
				invalid: bigAndSmallNumbers.andNaNs()
			},
			above: {
				valid: bigAndSmallNumbers,
				invalid: smallAndBigNumbers.andNaNs()
			},
			between: {
				valid: _.flatten( _.map( smallAndBigNumbers, function( pair ) {
					var reversePair = pair.slice().reverse();
					return [
						[ pair[ 0 ] ].concat( pair ),
						[ pair[ 1 ] ].concat( pair ),
						[ pair[ 0 ] + 0.1 ].concat( pair ),
						[ pair[ 1 ] - 0.1 ].concat( pair ),
						[ pair[ 0 ] ].concat( reversePair ),
						[ pair[ 1 ] ].concat( reversePair ),
						[ pair[ 0 ] + 0.1 ].concat( reversePair ),
						[ pair[ 1 ] - 0.1 ].concat( reversePair )
					];
				} ), true ),
				invalid: _.flatten( _.map( smallAndBigNumbers, function( pair ) {
					var cases = [];
					var reversePair = pair.slice().reverse();
					var smallerNumber = pair[ 0 ];
					var biggerNumber = pair[ 1 ];

					if( isFinite( smallerNumber ) ) {
						cases.push( [ smallerNumber - 0.1 ].concat( pair ) );
						cases.push( [ smallerNumber - 0.1 ].concat( reversePair ) );
					}
					if( isFinite( biggerNumber ) ) {
						cases.push( [ biggerNumber + 0.1 ].concat( pair ) );
						cases.push( [ biggerNumber + 0.1 ].concat( reversePair ) );

					}
					return cases;
				} ), true )
			}
		}
	} );
} );

