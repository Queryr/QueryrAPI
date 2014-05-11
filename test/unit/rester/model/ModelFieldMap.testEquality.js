'use strict';

var describeEqualsComparator = require( '../describeEqualsComparator' );

describe( 'ModelFieldMap#equals()', function() {
	describeEqualsComparator( {
		instanceProvider: require( './ModelFieldMap.testEquality.instanceProvider.js' )
	} );
} );
