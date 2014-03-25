'use strict';

module.exports = describeBasicValidatorsValidator;

var expect = require( 'expect.js' );
var describeValidatorInstance = require( './describeValidatorInstance' );

var validators = require( '../../../../../' ).rester.validators;
var Validators = validators.Validators;
var setBasicValidators = validators.basicValidators;

function describeBasicValidatorsValidator( validatorName, validArgumentsSet, invalidArgumentsSet ) {
	var basicValidators = setBasicValidators( new Validators() );
	var basicValidatorToBeDescribed = basicValidators.validator( validatorName );

	describeValidatorInstance(
		basicValidatorToBeDescribed,
		validArgumentsSet,
		invalidArgumentsSet
	);
}
