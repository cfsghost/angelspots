
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

			callback(err, doc);
		});
	}

	// Initializing previewer
	$('#form_content_previewer').css({
		padding: '30px'
	});

	// Initializing editor
	$('#form_content_editor').css({
		height: '100%',
		padding: '0px'
	});

	var editor = CodeMirror(document.getElementById('form_content_editor'), {
		mode: 'markdown',
		theme: 'base16-light',
		lineWrapping: true
	});

	editor.setSize('100%', '100%');

	editor.on('change', function() {
		if (state == 'ready')
			$('#toolbar_save').removeClass('disabled');

		saveRequired = true;
	});

	// Initializing subject input box
	$('#article_subject').on('input', function() {
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

		save(function(err, doc) {
			// Saved
			$('#form_content_previewer').html(doc.html);
		});
	});

	var preview = false;
	$('#toolbar_previewer').on('click', function() {
		if (preview) {
			preview = false;
			$('#form_content_editor').show();
			$('#form_content_previewer').hide();
		} else {
			preview = true;
			$('#form_content_editor').hide();
			$('#form_content_previewer').show();
		}
	});

	// Getting content
	if ($('#article_id').val()) {

		article.getArticle($('#article_id').val(), function(err, doc) {
			$('#article_subject').val(doc.subject);
			$('#form_content_previewer').html(doc.html);
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
				save(function(err, doc) {
					$('#form_content_previewer').html(doc.html);
				});

			}, 3000);

		});
	}
});
