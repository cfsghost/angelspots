
App.require('Article', function() {
	var article = App.Engine('Article');

	var state = 'initialize';

	if (window.location.hash) {
		var article_id = window.location.hash.replace('#', '');
		$('#article_id').val(article_id);
	}

	// Initializing Marked
	var renderer = new marked.Renderer();
	renderer.table = function(header, body) {
		return '<table class=\"ui table segment\">' +
			'<thead>' + header + '</thead>' +
			'<tbody>' + body + '</tbody>' +
			'</table>';
	};

	renderer.hr = function() {
		return '<div class=\"ui divider\"></div>';
	};

	// Save
	var saveRequired = false;
	var saveRunner;
	var savingRef = 0;
	function save(callback) {

		savingRef++;
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

			if (!$('#article_id').val()) {
				location.href = '#' + doc._id;
			}

			$('#article_id').val(doc._id);

			// Change status back
			savingRef--;
			if (savingRef == 0)
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
		lineWrapping: true,
		dragDrop: false
	});

	editor.setSize('100%', '100%');

	editor.on('change', function() {
		if (state == 'ready')
			$('#toolbar_save').removeClass('disabled');

		saveRequired = true;

		console.log(true);
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

	$('#toolbar_bold').on('click', function() {
		editor.replaceSelection('**' + editor.getSelection() + '**');
		editor.focus();
	});

	$('#toolbar_italic').on('click', function() {
		editor.replaceSelection('*' + editor.getSelection() + '*');
		editor.focus();
	});

	$('#toolbar_underline').on('click', function() {
		editor.replaceSelection('<u>' + editor.getSelection() + '</u>');
		editor.focus();
	});

	$('#toolbar_strikethrough').on('click', function() {
		editor.replaceSelection('~~' + editor.getSelection() + '~~');
		editor.focus();
	});

	$('#toolbar_link').on('click', function() {
		editor.replaceSelection('[' + editor.getSelection() + '](http://)');
		editor.focus();
	});

	$('#toolbar_blockquote').on('click', function() {
		editor.replaceSelection('\n> ' + editor.getSelection() + '\n');
		editor.focus();
	});

	$('#toolbar_previewer').on('click', function() {
		$(this)
			.addClass('active')
			.closest('.ui.menu')
			.find('.item')
			.not($(this))
			.removeClass('active');

		$('#form_content_editor').hide();
		$('#toolbar_edit').hide();

		marked(editor.getValue(), {
			renderer: renderer,
			breaks: true
		}, function(err, content) {
			$('#form_content_previewer').html(content);
			$('#form_content_previewer').show();
		});
	});

	$('#toolbar_edit_mode').on('click', function() {
		$(this)
			.addClass('active')
			.closest('.ui.menu')
			.find('.item')
			.not($(this))
			.removeClass('active');

		$('#toolbar_edit').show();
		$('#form_content_editor').show();
		$('#form_content_previewer').hide();
	});

	function autosaveInit() {

		// Intializing auto-save
		saveRequired = false;
		state = 'ready';

		function autosave() {

			if (!saveRequired)
				return;

			if (state == 'saving')
				return;

			// Saving it right now
			save(function(err, doc) {
			});
		}

		saveRunner = setInterval(autosave, 3000);
	}

	// Getting content
	if ($('#article_id').val()) {

		article.getArticle($('#article_id').val(), function(err, doc) {
			$('#article_subject').val(doc.subject);
			editor.setValue(doc.content, -1);

			autosaveInit();
		});
	} else {
		autosaveInit();
	}

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
});
