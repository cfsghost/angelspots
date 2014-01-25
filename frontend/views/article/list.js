
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
			var $column = $('<div>').addClass('twelve column wide');
			var $content = $('<div>').addClass('content');
			var $header = $('<div>').addClass('header').text(doc.subject);
			var $timestamp = $('<div>').addClass('description').text(ts.join(' '));
			var $link = $('<a>').attr('href', '/edit_article/' + doc._id);

			var $control_column = $('<div>').addClass('four column wide');

			// Create a label to display state of article and dropdown menu to set state
			var state_button = semblance.component.create('article_button');
			var $state_button = state_button.$dom;

			if (doc.published) {
				state_button.addFieldClass('buttons', 'teal');
				state_button.setFieldValue('label', 'Publish');
			} else {
				state_button.addFieldClass('buttons', 'purple');
				state_button.setFieldValue('label', 'Draft');
			}

			var menuItem = state_button.createSubComponent('item');
			menuItem.setFieldValue('label', 'Publish Now');

			// Enabling dropdown component
			$state_button.find('.ui.dropdown').dropdown();

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
