"use strict";

var Article = module.exports = function() {
	var self = this;
};

Article.prototype.listArticles = function(condition, callback) {

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({})
		.query(function(err, rows) {

			if (err) {
				callback(new Article.frex.Error('There is problem happened to user database'));
				return;
			}

			// No such user
			if (rows.length == 0) {
				callback(new Article.frex.Error('No article we have'));
				return;
			}

			callback(null, rows);

		});
};
