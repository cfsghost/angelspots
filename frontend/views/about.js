
App.require('Article', function() {
	var article = App.Engine('Article');

	article.getArticle('5mcswG7uEeOkqzfCIFIriA', function(err, doc) {
		$('#article_content').html(doc.html);

		$('.bb-item').show();
	});
	
});
