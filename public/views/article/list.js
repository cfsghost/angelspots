
App.require('Article', function() {
	var article = App.Engine('Article');

	article.listArticles({}, function(err, articles) {

		articles.forEach(function(doc, index, arr) {

			var $content = $('<div>').addClass('content');
			var $header = $('<div>').addClass('header').text(doc.subject);
			var $link = $('<a>').attr('href', '/edit_article/' + doc._id).addClass('item');
			var $publish_label = $('<div>').addClass('ui label red right floated').text('Not yet published');

			$content.append($header);
			$link
				.append($content)
				.append($publish_label);

			$('#article_list').append($link);
		});
	});
});
