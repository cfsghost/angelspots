
App.require('Article', function() {
	var article = App.Engine('Article');

	article.listArticles({}, function(err, articles) {
		console.log(articles);

		articles.forEach(function(doc, index, arr) {

			var $row = $('<div>').addClass('item');
			var $content = $('<div>').addClass('content');
			var $header = $('<div>').addClass('header').text(doc.subject);
			var $link = $('<a>').attr('href', '/edit_article/' + doc._id);

			$content.append($header);
			$link.append($content);
			$row.append($link);

			$('#article_list').append($row);
		});
	});
});
