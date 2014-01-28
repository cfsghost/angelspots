
var Middleware = require('courlan');

module.exports = {
	'/article/:article_id': function(req, res) {
		var article = req.frex.Engine('Article');

		// Getting article
		article.getArticle(req.params.article_id, function(err, doc) {

			res.render('article/index', {
				article_id: doc._id,
				article_html: doc.html
			});
		});
	},
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
