
App.require('Article', function() {
	var article = App.Engine('Article');

	article.listArticles({}, function(err, articles) {

		articles.forEach(function(doc, index, arr) {

			var item = semblance.component.create('article_item');
			item.setFieldValue('cover', 'images/test-photo.jpg');
			item.setFieldValue('name', doc.subject);

			$('#dashboard').append(item.$dom);

			item.$dom.on('click', function() {
				paper.setFieldValue('subject', doc.subject);
				paper.setFieldHTMLValue('content', doc.html);
				paper.$dom.modal('show');
			});

		});
	});

	// Initializing article paper
	var paper = semblance.component.create('article_paper');
	$('body').append(paper.$dom);
/*
	article.getArticleWithCondition({}, {}, function(err, doc) {
		$('#article_content').html(doc.html);

		$('.bb-item').show();

		return;
		$('#book').bookblock();

		$(document).on('keydown', function(e) {

			var keyCode = e.keyCode || e.which;
			var arrow = {
				left : 37,
				up : 38,
				right : 39,
				down : 40
			};

			switch (keyCode) {
			case arrow.left:
				$('#book').bookblock('prev');
				break;

			case arrow.right:
				$('#book').bookblock('next');
			break;
			}
		});
	});
*/	
});
