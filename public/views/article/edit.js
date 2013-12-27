
App.require('Article', function() {
	var article = App.Engine('Article');

	var state = 'initialize';

	// Save
	var saveRequired = false;
	var saveRunner;
	function save(callback) {

		saveRequired = false;
		state = 'saving';

		// Disable save button
		$('#toolbar_save').addClass('disabled');

		article.updateArticle($('#article_id').val(), {
			subject: $('#article_subject').val(),
			content: editor.getValue()
		}, function(err, doc) {
			if (err) {
				callback(err)
				return;
			}

			$('#article_id').val(doc._id);

			// Change status back
			state = 'ready';

			callback();
		});
	}

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

	editor.on('change', function() {

		if (state == 'ready')
			$('#toolbar_save').removeClass('disabled');

		saveRequired = true;
	});

	// Side panel
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
		if ($('#toolbar_save').hasClass('disabled'))
			return;

		save(function() {
			// Saved
		});
	});

	// Getting content
	if ($('#article_id').val()) {

		article.getArticle($('#article_id').val(), function(err, doc) {
			$('#article_subject').val(doc.subject);
			editor.setValue(doc.content, -1);

			// Intializing auto-save
			saveRequired = false;
			state = 'ready';
			saveRunner = setInterval(function() {
				if (!saveRequired)
					return;

				if (state == 'saving')
					return;

				// Saving it right now
				save(function() {
				});

			}, 3000);

		});
	}
});