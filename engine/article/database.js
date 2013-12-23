"use strict";

var DBHouse = require('dbhouse');

// Define schema
var model = {

	schema: new DBHouse.Schema({
		_id: { type: 'UUID' },
		author: { type: 'String' },
		author_id: { type: 'String' },
		subject: { type: 'String' },
		content: { type: 'String' },
		created: { type: 'Date', default: Date.now }
	}),
	index: new DBHouse.Index([
	    { fields: [ 'subject' ] },
	    { fields: [ 'created' ] }
	])
};

module.exports = {
	dbHouse: new DBHouse(),
	settings: {},
	model: model,
	db: null
};
