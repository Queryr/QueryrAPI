'use strict';

var TypeSpec = require( './TypeSpec' );

// TODO: Perhaps not a real "builder". Maybe the logic from TypeSpec should move in here and
//       TypeSpec itself should be immutable.
//       OR, just make TypeSpec members return copies instead of self-references.
//       OR, Have a TypeSpecs like Validators, TypeSpec should not know its own name and .property()
//           should take a string

/**
 * Allows to describe field types.
 *
 * @param {Object} commonValidators Map of validator names and validator functions which should be
 *        available for all type specifications created with this TypeSpecBuilder instance.
 *
 * TODO: Instead of commonValidators, allow to specify a baseTypeSpec.
 *
 * @constructor
 */
module.exports = function TypeSpecBuilder( commonValidators ) {
	commonValidators = commonValidators || {};

	/**
	 * Creates a new TypeSpec instance with all common validators known to the this builder.
	 *
	 * @param {string} name
	 * @returns TypeSpec
	 */
	this.typeSpec = function( name ) {
		return ( new TypeSpec( name ) )
			.validators( commonValidators );
	};
};
