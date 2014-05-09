'use strict';

var TypeSpec = require( '../typeSpeccer/TypeSpec' );

/**
 * TypeSpec instance to be used within a ModelDesign's field for describing that the value of this
 * field in an actual model implementation's instance should point to an instance of another
 * ModelDesign's model implementation.
 *
 * This TypeSpec might be of little use outside of the package but has to be handled by all
 * ModelImplementer implementations.
 *
 * @type {TypeSpec}
 */
module.exports = new TypeSpec( 'reference' )
	.descriptor( {
		name: 'to',
		validate: function( value ) {
			return value && typeof value === 'string';
		}
	} )
	.use( function( value, descriptors ) {
		// Always fail since the TypeSpec is only used as reference within ModelDesign instances.
		throw new Error( 'no value is a valid "reference" value' );
	} );
