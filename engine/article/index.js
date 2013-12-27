"use strict";

var DBHouse = require('dbhouse');

// Constructor
var constructor = function(engine, callback) {

	console.log('Initializing Article engine ...');

	var dbHouse = engine.database.dbHouse;
	var model = engine.database.model;
	var dbSettings = engine.settings.database;

	// Connect to database
	dbHouse.connect(dbSettings.driver, { host: dbSettings.host, port: dbSettings.port }, function() {

		engine.database.db = new DBHouse.Database(dbHouse);

		// Create Index
		engine.database.db.open(dbSettings.dbName)
			.collection(dbSettings.table)
			.model(model.schema, model.index)
			.createIndex();

		callback();
	});
};

// Metadata
module.exports = {
	type: 'engine',
	engine_name: 'Article',
	prototype: require('./prototype'),
	constructor: constructor,
	database: require('./database'),
	statuscode: {
		SYSERR: -1,
		EMPTY: 0,
		INVALID: 1,
		EXISTS: 2,
		NONEXIST: 3,
		NOPERM: 4
	},
	check_permission: function(conn, callback) {

		if (!conn.req.session.username)
			callback(false);

		if (!conn.req.session.permission)
			callback(false);

		if (conn.req.session.permission.admin) {
			callback(true);
		} else {
			callback(false);
		}
	}
};
