'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeEqualsComparator = require( '../describeEqualsComparator' );

var equalModelFieldMapInstanceProvider = require( './ModelFieldMap.testEquality.instanceProvider.js' );

var rester = require( '../../../../' ).rester;
var ModelDesign = rester.model.ModelDesign;

describe( 'ModelDesign#equals()', function() {
	describeEqualsComparator( {
		instanceProvider: function() {
			var ret = {};

			_.each( equalModelFieldMapInstanceProvider(), function( equalFieldMapsSet, equalFieldMapsDescription ) {
				var equalModelDesigns = [];

				equalFieldMapsSet = _.isArray( equalFieldMapsSet ) ? equalFieldMapsSet : [ equalFieldMapsSet ];
				_.each( equalFieldMapsSet, function( fieldMap, i ) {
					equalModelDesigns.push( new ModelDesign( fieldMap ) );
				} );

				ret[ 'ModelDesign using ' + equalFieldMapsDescription ] = equalModelDesigns;
			} );

			return ret;
		}
	} );
} );
