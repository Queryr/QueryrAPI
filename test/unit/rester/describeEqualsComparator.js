'use strict';

module.exports = describeEqualsComparator;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

/**
 * @example <code>
 *
 * </code>
 */
function describeEqualsComparator( options ) {
	function createInstancesSet() {
		var instances = options.instanceProvider();
		var ret = {};
		var i = 0;
		_.each( instances, function( value, key ) {
			i++;
			ret[ '<<' + i + '> ' + key + '>' ] = value;
		} );
		return ret;
	}

	var testInstancesSet = createInstancesSet();
	var testInstancesSet2 = createInstancesSet();

	_.each( testInstancesSet, function( testInstance, instanceDescription ) {
		var otherInstances = _.extend( testInstancesSet );
		delete( otherInstances[ instanceDescription ] );

		describe( 'on ' + instanceDescription, function() {
			describe( 'with equal Instance as another instance', function() {
				it( 'should be equal', function() {
					var anotherTestInstance = testInstancesSet2[ instanceDescription ];
					expect( testInstance.equals( anotherTestInstance ) ).to.be( true );
					expect( anotherTestInstance.equals( testInstance ) ).to.be( true );
				} );
			} );

			describeEqualsComparatorForInstance( testInstance, otherInstances );
		} );
	} );
}

function describeEqualsComparatorForInstance( instance, otherInstances ) {
	describe( 'with same object', function() {
		it( 'should be equal', function() {
			expect( instance.equals( instance ) ).to.be( true );
		} );
	} );

	_.each( otherInstances, function( otherInstance, instanceDescription ) {
		describe( 'with ' + instanceDescription, function() {
			it( 'should not be equal', function() {
				expect( instance.equals( otherInstance ) ).to.be( false );
				expect( otherInstance.equals( instance ) ).to.be( false );
			} );
		} );
	} );

	describeEqualsComparatorNotEqualToUnrelatedValue( instance );
}

function describeEqualsComparatorNotEqualToUnrelatedValue( instance ) {
	var unrelatedValues = {
		number: 42,
		undefined: undefined,
		'null': null,
		string: 'foo',
		regex: /./,
		'object literal': {},
		'array literal': [],
		'Date object': new Date()
	};
	for( var valueType in unrelatedValues ) {
		var unrelatedValue = unrelatedValues[ valueType ];
		describe( 'with unrelated "' + valueType + '" value ' + unrelatedValue, function() {
			it( 'should not be equal', function() {
				expect( instance.equals( unrelatedValue ) ).to.be( false );
			} );
		} );
	}
}
