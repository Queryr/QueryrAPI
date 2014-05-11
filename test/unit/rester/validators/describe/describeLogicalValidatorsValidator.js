'use strict';

module.exports = describeLogicalValidatorsValidator;

var expect = require( 'expect.js' );
var describeValidatorInstance = require( './describeValidatorInstance' );

var validators = require( '../../../../../' ).rester.validators;
var Validators = validators.Validators;
var applyLogicalValidators = validators.logicalValidators;

function describeLogicalValidatorsValidator( validatorName, validArgumentsSet, invalidArgumentsSet ) {
	var logicValidators = applyLogicalValidators( new Validators() );
	var logicValidatorToBeDescribed = logicValidators.validator( validatorName );

	describeValidatorInstance(
		logicValidatorToBeDescribed,
		validArgumentsSet,
		invalidArgumentsSet
	);
}
