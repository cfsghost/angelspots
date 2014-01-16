
App.require('Article', function() {
	var article = App.Engine('Article');

	article.listArticles({}, function(err, articles) {

		articles.forEach(function(doc, index, arr) {

			var now = new Date(doc.updated);
			var pad = function(num) {
				return ('00' + num).slice(-2);
			};
			var ts = [
				now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()),
				pad(now.getHours()) + ':' + pad(now.getMinutes())
			];

			var $content = $('<div>').addClass('content');
			var $header = $('<div>').addClass('header').text(doc.subject);
			var $timestamp = $('<div>').addClass('description').text(ts.join(' '));
			var $link = $('<a>').attr('href', '/edit_article/' + doc._id).addClass('item');
			var $state_label = $('<div>').addClass('ui label right floated');

			if (doc.published)
				$state_label.addClass('green').text('Published');
			else
				$state_label.addClass('purple').text('Draft');

			$content.append($header).append($timestamp);
			$link
				.append($content)
				.append($state_label);

			$('#article_list').append($link);
		});
	});
});
