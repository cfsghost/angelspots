
var Middleware = require('courlan');

module.exports = {
	'/edit_article': [
		Middleware.AdminRequired,
		function(req, res) {
			res.render('article/edit', { article_id: '' });
		}
	],
	'/edit_article/:article_id': [
		Middleware.AdminRequired,
		function(req, res) {
			res.render('article/edit', { article_id: req.params.article_id || '' });
		}
	],
	'/list_article': [
		Middleware.AdminRequired,
		function(req, res) {
			res.render('article/list');
		}
	]
};
