
App.require('Article', function() {
	var article = App.Engine('Article');

	article.getArticleWithCondition({}, {}, function(err, doc) {
		$('#article_content').html(doc.html);

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
	
});
