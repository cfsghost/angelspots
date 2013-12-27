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
				callback(new Article.frex.Error('There is problem happened to article database'));
				return;
			}

			// No article we found
			if (rows.length == 0) {
				callback(new Article.frex.Error('No article we have'));
				return;
			}

			callback(null, rows);

		});
};

Article.prototype.updateArticle = function(id, article, callback) {
	var self = this;

	if (!(article instanceof Object)) {
		callback(new Article.frex.Error('Failed', engine.statuscode.INVALID));
		return;
	}

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (id == '' || !id) {

		// Create a new article
		db.open(dbSettings.dbName)
			.collection(dbSettings.table)
			.model(model.schema)
			.insert({
				subject: article.subject || '',
				content: article.content || ''
			}, function(err, row) {

				if (err) {
					callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
					return;
				}

				// Send article information back
				callback(null, {
					_id: row._id,
					subject: row.subject,
					content: row.content
				});
			});

		return;
	}

	// Update article existed
	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			_id: id
		})
		.limit(1)
		.update({
			subject: article.subject || '',
			content: article.content || '',
			updated: Date.now()
		}, { return_new_data: true } ,function(err, rows) {

			if (err) {
				callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
				return;
			}

			if (!rows.length) {
				callback(new Article.frex.Error('Failed', engine.statuscode.INVALID));
				return;
			}

			callback(null, {
				_id: rows[0]._id,
				subject: rows[0].subject,
				content: rows[0].content
			});
		});
};

Article.prototype.getArticle = function(id, callback) {

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			_id: id
		})
		.limit(1)
		.query(function(err, rows) {

			if (err) {
				callback(new Article.frex.Error('There is problem happened to article database'));
				return;
			}

			// No such article
			if (rows.length == 0) {
				callback(new Article.frex.Error('No article we have'));
				return;
			}

			callback(null, rows[0]);
		});
};
