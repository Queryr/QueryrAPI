'use strict';

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec()
		.use( Number )
		.validator(
			'even',
			function even( value ) {
				return value % 2 === 0;
			}
		)
		.validator(
			'odd',
			function odd( value ) {
				return value % 2 !== 0;
			}
		)
		.validator(
			[ 'below', 'lessThan' ],
			function( value, boundary ) {
				return value < boundary;
			}
		)
		.validator(
			[ 'above', 'greaterThan' ],
			function( value, boundary ) {
				return value > boundary;
			}
		)
		.validator(
			[ 'between', 'within' ],
			function( value, min, max ) {
				if( min > max ) {
					var newMin = max;
					max = min;
					min = newMin;
				}
				return value >= min && value <= max;
			}
		)
	;
};
