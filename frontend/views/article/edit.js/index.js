
App.require('Article', function() {
	var article = App.Engine('Article');

	if (window.location.hash) {
		var article_id = window.location.hash.replace('#', '');
		$('#article_id').val(article_id);
	}

	// Side panel
	$('#sidepanel_publish_button').on('click', function() {

		$('#publish_dialog')
			.modal('setting', {
				onApprove: function() {

					// Publish
					article.publish($('#article_id').val(), function() {

						setTimeout(function() {
							$('#publish_success_dialog').modal('show');
						}, 600);
					});
				}
			})
			.modal('show');
	});

	$('.ui.modal').modal();
	$('#toolbar_edit .ui.button').popup();

	// Initializing editor
	var editor = new Editor('#form_content_editor');

	// Save event
	editor.on('save', function(content, complete) {

		// Save to server
		article.updateArticle($('#article_id').val(), {
			subject: $('#article_subject').val(),
			content: content
		}, function(err, doc) {
			if (err) {
				complete(err)
				return;
			}

			if (!$('#article_id').val()) {
				location.href = '#' + doc._id;
			}

			$('#article_id').val(doc._id);

			complete();
		});
	});

	// Getting content
	if ($('#article_id').val()) {

		article.getArticle($('#article_id').val(), function(err, doc) {
			$('#article_subject').val(doc.subject);

			// Editor is loading content
			editor.load(doc.content);
			editor.enabledAutosave(true);
		});

	} else {
		editor.enabledAutosave(true);
	}

	// Initializing subject input box
	$('#article_subject').on('input', function() {
		if (editor.state == 'ready')
			$('#toolbar_save').removeClass('disabled');

		editor.saveRequired = true;
	});

/*
	// Initializing Uploader
	$('#upload_area').filedrop({
		allowedfiletypes: [ 'image/jpeg', 'image/png', 'image/gif' ],
		allowedfileextensions: [ '.jpg', '.jpeg', '.png', '.gif' ],
		dragOver: function() {
			$('#upload_area').css('outline', '3px dashed #aaaaaa');
		},
		dragLeave: function() {
			$('#upload_area').css('outline', '0px');
		},
		beforeSend: function(file, i, done) {
			$('#upload_area').css('outline', '0px');

			editor.replaceSelection('![New Image]()');
			editor.focus();
		}
	});
*/
});
