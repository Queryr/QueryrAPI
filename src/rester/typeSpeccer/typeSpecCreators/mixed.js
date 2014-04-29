'use strict';

// TODO: Rename ModelField into TypeUsage and move it in this module
var ModelField = require( './../../model/ModelField' );
var Asserter = require( './../../assert/Asserter' );
var TypeSpec = require( './../TypeSpec' );

module.exports = function( typeSpec ) {
	return typeSpec
		.descriptor( {
			name: 'restrictedTo',
			validate: function( restrictionTypes ) {
				if( restrictionTypes === undefined ) {
					return true;
				}
				if( restrictionTypes instanceof ModelField ) {
					restrictionTypes = [ restrictionTypes ];
				}
				return restrictionTypes.every( function( restrictionType ) {
					return restrictionType instanceof ModelField;
				} );
			},
			compare: function( descriptor, otherDescriptor ) {
				if( descriptor.length !== otherDescriptor.length ) {
					return false;
				}
				return descriptor.every( function( restrictionType, i ) {
					return restrictionType.equals( otherDescriptor[ i ] );
				} );
			}
		} )
		.use( function( value, descriptors ) {
			if( descriptors.restrictedTo === undefined ) {
				return true;
			}
			var restrictionTypes = descriptors.restrictedTo;
			if( restrictionTypes instanceof ModelField ) {
				restrictionTypes = [ restrictionTypes ];
			}
			var valueIsSupported = false;
			for( var i = 0; i < restrictionTypes.length; i++ ) {
				var typeUsage = restrictionTypes[ i ]; // aka ModelField
				if( !( typeUsage instanceof ModelField ) ) {
					throw new Error( 'mixed type restriction has to be given as one or more '
						+ 'ModelField instances' );
				}
				try {
					typeUsage.type().use( typeUsage.descriptors() )( value );
					var assertion = typeUsage.assertion();
					if( assertion ) {
						var asserterForType = new Asserter( typeUsage.type().validators() );
						asserterForType.assert( assertion.withUnknown( value ) );
					}
					valueIsSupported = true;
					break;
				} catch( e ) {}
			}
			if( !valueIsSupported ) {
				throw new Error( 'given value is not supported' );
			}
			return true;
		} )
	;
};
