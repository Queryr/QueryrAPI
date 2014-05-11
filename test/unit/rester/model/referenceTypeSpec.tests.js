'use strict';

var rester = require( '../../../../' ).rester;
var referenceTypeSpec = rester.model.referenceTypeSpec;

var describeTypeSpecInstance = require( '../typeSpeccer/describe/describeTypeSpecInstance' );

describe( 'reference TypeSpec instance', function() {
	describeTypeSpecInstance( referenceTypeSpec, {
		descriptors: {
			'"to" set to "someOtherModel"': {
				'.to': 'someOtherModel',
				valid: [],
				invalid: [ 0, null, undefined, false, true, 'foo', /./, new Date(), [], {} ]
			}
		}
	} );


} );
