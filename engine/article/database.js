"use strict";

var DBHouse = require('dbhouse');

// Define schema
var model = {

	schema: new DBHouse.Schema({
		_id: { type: 'UUID' },
		author: { type: 'String' },
		author_id: { type: 'UUID' },
		subject: { type: 'String' },
		content: { type: 'String' },
		html: { type: 'String' },
		published: { type: 'Boolean', default: false },
		updated: { type: 'Date', default: Date.now },
		created: { type: 'Date', default: Date.now }
	}),
	index: new DBHouse.Index([
	    { fields: [ 'subject' ] },
	    { fields: [ 'created' ] }
	])
};

module.exports = {
	dbHouse: new DBHouse(),
	model: model,
	db: null
};
