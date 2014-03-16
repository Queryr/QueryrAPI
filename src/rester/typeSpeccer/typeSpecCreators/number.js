'use strict';

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec( 'number ')
		.use( function( value ) {
			return typeof value === 'number';
			// TODO: Think about how we want to handle NaN and Infinite. Either have validations
			//  for those or have separate types and exclude them from number.
		} )
		.validator(
			function even( value ) {
				return value % 2 === 0;
			},
			'to be even'
		)
		.validator(
			function odd( value ) {
				return value % 2 !== 0;
			},
			'to be odd'
		)
		.validator(
			function below( value, boundary ) {
				return value < boundary;
			},
			'to be below $1'
		) // TODO: .alias( 'lessThan')
		.validator(
			function above( value, boundary ) {
				return value > boundary;
			},
			'to be above $1'
		) // TODO: .alias( 'greaterThan')
		.validator(
			function between( value, min, max ) {
				var minMax = sortMinMax( min, max );
				return value >= minMax.min && value <= minMax.max;
			},
			function( min, max ) {
				var minMax = sortMinMax( min, max );
				return 'to be between ' + minMax.min + ' and ' + minMax.max;
			}
		) // TODO: .alias( 'within')
	;

	///////////
	// HELPERS:

	function sortMinMax( min, max ) {
		return min > max ? { min: max, max: min } : { min: min, max: max};
	}
};
