
App.require('Article', function() {
	var article = App.Engine('Article');

	// Initializing editor
	$('#form_content_editor').css({
		height: 500
	});
	var editor = ace.edit('form_content_editor');
	editor.container.style.fontFamily = 'Droid Sans Mono';
	editor.setFontSize(16);
	editor.setTheme('ace/theme/tomorrow');

	var MarkdownMode = require('ace/mode/markdown').Mode;
	var session = editor.getSession()
	session.setMode(new MarkdownMode());
	session.setUseWrapMode(true);
	session.setWrapLimitRange();

	$('#sidepanel_publish_button').on('click', function() {
		$('#publish_dialog')
			.modal('setting', {
				onApprove: function() {
				}
			})
			.modal('show');
	});

	$('.ui.modal').modal();
	$('.attached.message .header .ui.button').popup();

	// Toolbar
	$('#toolbar_save').on('click', function() {

		article.updateArticle($('#article_id').val(), {
			subject: $('#article_subject').val(),
			content: editor.getValue()
		}, function(err, doc) {
			if (err)
				return;

			$('#article_id').val(doc._id);
		});
	});

	// Getting content
	if ($('#article_id').val()) {

		article.getArticle($('#article_id').val(), function(err, doc) {
			$('#article_subject').val(doc.subject);
			editor.setValue(doc.content, -1);
		});
	}
});
