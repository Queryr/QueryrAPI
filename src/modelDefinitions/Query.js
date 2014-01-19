'use strict';

module.exports = function designQuery( modelDesigner ) {

	modelDesigner.model( 'query' )

		.field( 'name' )
			.as.string().with.length.above( 0 )
			.or
			.as.null()

		.field( 'isPublic' )
			.as.boolean()

		.field( 'description' )
			.as.string().with.length.between( 1 ).and( 1000 )
			.or
			.as.null()

		.field( 'owner' )
			.as.instance().of( modelDesigner.model( 'user' ) ) // TODO: something like that
	;

};

