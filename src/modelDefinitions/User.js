'use strict';

// var QueryrModel = require( 'QueryrModel' );

module.exports = function designUser( modelDesigner ) {

	modelDesigner.model( 'user' )
		//.extends( QueryrModel )
		.field( 'name' )
			.as.string//.with.length.above( 0 )
			.or
			.as.null

		.field( 'mailAddress' )
			.as.string
				//.is.mail() // TODO: implement
	;

};
