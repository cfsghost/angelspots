
var Middleware = require('courlan');

module.exports = {
	'/new_article': [
		Middleware.LoginRequired,
		function(req, res) {
			res.render('article/new');
		}
	]
};
