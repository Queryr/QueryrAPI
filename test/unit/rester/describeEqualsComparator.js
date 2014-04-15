'use strict';

module.exports = describeEqualsComparator;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

/**
 * Describes how an "equal" function should behave.
 *
 * @option {function} instanceProvider Has to return a map of instances. The key of each instance
 *         value should be a short description. Instead of a single instance, an array of equal
 *         instances can be provided (useful for testing instances created with different
 *         constructor arguments).
 *
 * @example <code>
 *     describeEqualsComparator( {
 *         instanceProvider: function() {
 *             return {
 *                 'Foo with two values': new Foo( [ 42, true ] ),
 *                 'Foo without values': [
 *                     new Foo(),
 *                     new Foo( [] )
 *                 ]
 *             }
 *         }
 *     } );
 * </code>
 */
function describeEqualsComparator( options ) {
	function createSetOfEqualInstancesSets() {
		var instances = options.instanceProvider();
		var ret = [];
		var i = 0;

		_.each( instances, function( equalInstancesSet, instancesDescription ) {
			i++;
			var normalizedEqualInstancesSet = [];

			if( !_.isArray( equalInstancesSet ) ) {
				equalInstancesSet = [ equalInstancesSet ];
			}
			_.each( equalInstancesSet, function( instance, j ) {
				var id = equalInstancesSet.length > 1
					? i + '.' + j :
					i + '';
				normalizedEqualInstancesSet.push( {
					id: id,
					instance: instance,
					description: '<<' + id + '> ' + instancesDescription + '>'
				} );
			} );
			ret.push( normalizedEqualInstancesSet );
		} );
		return ret;
	}

	var setOfInstDescrSets = createSetOfEqualInstancesSets();
	var setOfInstDescrSets2 = createSetOfEqualInstancesSets();

	if( setOfInstDescrSets.length < 2 ) {
		throw new Error( 'instanceProvider should at least return two instances' );
	}

	expect( setOfInstDescrSets.length ).to.be( _.values( options.instanceProvider() ).length );
	expect(
		_.flatten( setOfInstDescrSets ).length
	).to.be(
		_.flatten( options.instanceProvider() ).length
	);

	_.each( setOfInstDescrSets, function( equalInstancesSet, i ) {
		var unequalInstDescrSet = _.flatten( _.filter( setOfInstDescrSets, function( instDescrSet ) {
			return equalInstancesSet !== instDescrSet;
		} ) );

		expect(
			unequalInstDescrSet.length
		).to.be(
			_.flatten( setOfInstDescrSets ).length - equalInstancesSet.length
		);

		_.each( equalInstancesSet, function( instDescr, j ) {
			describe( 'on ' + instDescr.description, function() {
				describe( 'with Instance created from same constructor parameters', function() {
					itShouldBeEqual( instDescr.instance, setOfInstDescrSets2[ i ][ j ].instance );
				} );

				var equalInstDescrSet = equalInstancesSet.slice( j + 1 );

				describeEqualsComparatorWithEqualInstances( instDescr.instance, equalInstDescrSet );
				describeEqualsComparatorWithUnequalInstances( instDescr.instance, unequalInstDescrSet );
				describeEqualsComparatorWithUnrelatedValue( instDescr.instance );
			} );
		} );
	} );
}

function describeEqualsComparatorWithEqualInstances( instance, equalInstDescrSet ) {
	_.each( equalInstDescrSet, function( equalInstDescr ) {
		describe( 'with ' + equalInstDescr.description, function() {
			itShouldBeEqual( instance, equalInstDescr.instance );
		} );
	} );
}

function describeEqualsComparatorWithUnequalInstances( instance, unequalInstDescrSet ) {
	describe( 'with same instance', function() {
		itShouldBeEqual( instance, instance );
	} );

	_.each( unequalInstDescrSet, function( unequalInstDescr ) {
		describe( 'with ' + unequalInstDescr.description, function() {
			itShouldNotBeEqual( instance, unequalInstDescr.instance );
		} );
	} );
}

function describeEqualsComparatorWithUnrelatedValue( instance ) {
	var unrelatedValues = {
		number: 42,
		undefined: undefined,
		'null': null,
		'boolean (false)': false,
		'boolean( true)': true,
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

function itShouldBeEqual( instance1, instance2, notEqual ) {
	it( 'should be equal', function() {
		expect( instance1.equals( instance2 ) ).to.be( !notEqual );
		expect( instance2.equals( instance1 ) ).to.be( !notEqual );
	} );
}

function itShouldNotBeEqual( instance1, instance2 ) {
	return itShouldBeEqual( instance1, instance2, true );
}
