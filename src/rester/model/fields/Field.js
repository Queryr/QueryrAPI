// TODO: REMOVE FILE!
"use strict";

function extendableConstructor( constructor, proto ) {
	if( proto ) {
		return inheritWithExtend( constructor, proto );
	}

	constructor.extend = function( extension ) {
		return inheritWithExtend( constructor, extension );
	};
	return constructor;
}

function inheritWithExtend( base, constructor, proto ) {
	if( !proto ) {
		proto = constructor;
	}
	var NewConstructor = constructor || function() {
		base.apply( this, arguments );
	};
	NewConstructor.prototype = Object.create( base );
	for( var field in proto ) {
		if( proto.hasOwnProperty( field ) ) {
			NewConstructor.prototype[ field ] = proto[ field ];
		}
	}
	NewConstructor.prototype.constructor = NewConstructor;

	NewConstructor.extend = function( extension ) {
		return inheritWithExtend( NewConstructor, extension );
	};
	return NewConstructor;
}

/**
 * Abstract base for field definitions. Field definitions serve the purpose of describing a
 * model's fields. The actual field constructor determines of what type the field has to be.
 *
 * @param {*} defaultValue
 *
 * @constructor
 * @abstract
 */
var Field = function Field( defaultValue ) {
	if( !( this instanceof Field ) ) {
		return new Field( defaultValue );
	}

	if( this.constructor.TYPE === null ) {
		throw Error( 'Can not instantiate abstract field instance of no specific type. ' +
			'The constructor\'s "TYPE" field has to be defined.' );
	}

	this._default = defaultValue;

	var self = this;
	self.validate.not = function() {
		// TODO also had to define validate in here to make this work
	};
};

Field.prototype = {
	constructor: Field,

	getType: function() {
		return this.constructor.TYPE;
	},

	hasDefault: function() {
		return this.default !== undefined;
	},

	getDefault: function() {
		return this._default;
	},

	assert: function( name /*, param1, param2, ..., paramN */ ) {
		// TODO
		return this; // TODO: Return copy of this for templates.
	},

	or: function() {

	},

	_nestingLevel: 0,

	'(': function() {
		var copy = this; // TODO: copy
		copy._nestingLevel++;
	},

	')': function() {
		var copy = this; // TODO: copy

		copy._nestingLevel--;
		if( copy._nestingLevel < 1 ) {
			throw new Error( 'Can not call ")" without prior "(" call.' );
		}

		return copy;
	}
};

extendableConstructor( Field );

Field.TYPE = null;

module.exports = Field;