'use strict';

module.exports = describeBasicValidatorsValidator;

var expect = require( 'expect.js' );
var describeValidatorInstance = require( './describeValidatorInstance' );

var validators = require( '../../../../../' ).rester.validators;
var Validators = validators.Validators;
var applyBasicValidators = validators.basicValidators;

function describeBasicValidatorsValidator( validatorName, validArgumentsSet, invalidArgumentsSet ) {
	var basicValidators = applyBasicValidators( new Validators() );
	var basicValidatorToBeDescribed = basicValidators.validator( validatorName );

	describeValidatorInstance(
		basicValidatorToBeDescribed,
		validArgumentsSet,
		invalidArgumentsSet
	);
}
