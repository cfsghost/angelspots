
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

			var $item = $('<div>').addClass('ui item grid');
			var $column = $('<div>').addClass('fourteen column wide');
			var $content = $('<div>').addClass('content');
			var $header = $('<div>').addClass('header').text(doc.subject);
			var $timestamp = $('<div>').addClass('description').text(ts.join(' '));
			var $link = $('<a>').attr('href', '/edit_article/' + doc._id);

			var $control_column = $('<div>').addClass('two column wide');
			var $state_button = $('<div>').addClass('ui button right floated horizontal');

			if (doc.published)
				$state_button.addClass('green').text('Published');
			else
				$state_button.addClass('purple').text('Draft');

			$content
				.append($header)
				.append($timestamp);

			$link
				.append($content);

			$column.append($link);

			$control_column.append($state_button);

			$item
				.append($column)
				.append($control_column);

			$('#article_list').append($item);
		});
	});
});
