"use strict";

var marked = require('marked');
var hljs = require('highlight.js');

// Initializing Renderer of Marked
var renderer = new marked.Renderer();
renderer.table = function(header, body) {
	return '<table class=\"ui table segment\">' +
		'<thead>' + header + '</thead>' +
		'<tbody>' + body + '</tbody>' +
		'</table>';
};

renderer.hr = function() {
	return '<div class=\"ui divider\"></div>';
};

renderer.blockquote = function(content) {
	return '<div class=\"ui message\">' + content + '</div>';
};       

renderer.code = function(code, lang) {
	return '<div class=\"ui message\"><pre><code class=\"lang-' + lang + '\">' + hljs.highlightAuto(code).value + '</code></pre></div>';
};

var Article = module.exports = function() {
	var self = this;
};

Article.prototype.listArticles = function(condition, callback) {

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (!(callback instanceof Function))
		return;

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

	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (!(callback instanceof Function))
		return;

	if (!(article instanceof Object)) {
		callback(new Article.frex.Error('Failed', engine.statuscode.INVALID));
		return;
	}

	// Check permission
	var conn = Article.frex.getConnection(arguments);
	if (!conn.req.session.permission) {
		callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
		return;
	}

	if (!conn.req.session.permission.admin) {
		callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
		return;
	}

	var html = '';
	marked(article.content || '', {
		renderer: renderer,
		breaks: true
	}, function(err, content) {
		if (!err)
			html = content;

		if (id == '' || !id) {

			// Create a new article
			db.open(dbSettings.dbName)
				.collection(dbSettings.table)
				.model(model.schema)
				.insert({
					subject: article.subject || '',
					content: article.content || '',
					html: html
				}, function(err, row) {

					if (err) {
						callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
						return;
					}

					// Send article information back
					callback(null, {
						_id: row._id,
						subject: row.subject,
						content: row.content,
						html: row.html
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
				html: html,
				updated: Date.now()
			}, { return_new_data: true } ,function(err, row) {

				if (err) {
					callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
					return;
				}

				callback(null, {
					_id: row._id,
					subject: row.subject,
					content: row.content,
					html: row.html
				});
			});

	});
};

Article.prototype.getArticle = function(id, callback) {

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (!(callback instanceof Function))
		return;

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

Article.prototype.getArticleWithCondition = function(condition, opts, callback) {
	var self = this;

	var conn = Article.frex.getConnection(arguments);
	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (!(callback instanceof Function))
		return;

	if (!(condition instanceof Object)) {
		callback(new Article.frex.Error('Failed', engine.statuscode.INVALID));
		return;
	}

	if (!(opts instanceof Object)) {
		callback(new Article.frex.Error('Failed', engine.statuscode.INVALID));
		return;
	}

	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where(condition)
		.order('updated', -1)
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

Article.prototype.publish = function(id, callback) {
	var self = this;

	var engine = Article.engine;
	var model = engine.database.model;
	var db = engine.database.db;
	var dbSettings = engine.settings.database;

	if (!(callback instanceof Function))
		return;

	// Check permission
	var conn = Article.frex.getConnection(arguments);
	if (!conn.req.session.permission) {
		callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
		return;
	}

	if (!conn.req.session.permission.admin) {
		callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
		return;
	}

	// Update article state
	db.open(dbSettings.dbName)
		.collection(dbSettings.table)
		.model(model.schema)
		.where({
			_id: id
		})
		.limit(1)
		.update({
			published: true,
			updated: Date.now()
		}, function(err, row) {

			if (err) {
				callback(new Article.frex.Error('Failed', engine.statuscode.SYSERR));
				return;
			}

			callback(null);
		});
};
