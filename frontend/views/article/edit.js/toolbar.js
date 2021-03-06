"use strict";

var Toolbar = function(editor) {
	var self = this;

	self.editor = editor;
	self.$dom = $('#toolbar'); 

	// Save button
	$('#toolbar_save').on('click', function() {

		if ($('#toolbar_save').hasClass('disabled'))
			return;

		self.editor.func.save(function(err) {

			// Saved
			$('#form_content_previewer').html(self.editor.core.getValue());
		});
	});

	// Bold
	$('#toolbar_bold').on('click', function() {
		self.editor.func.bold();
	});

	// Italic
	$('#toolbar_italic').on('click', function() {
		self.editor.func.italic();
	});

	// Underline
	$('#toolbar_underline').on('click', function() {
		self.editor.func.underline();
	});

	// Strike through
	$('#toolbar_strikethrough').on('click', function() {
		self.editor.func.strikeThrough();
	});

	// Link
	$('#toolbar_link').on('click', function() {
		self.editor.func.link();
	});

	// Blockquote
	$('#toolbar_blockquote').on('click', function() {
		self.editor.func.blockquote();
	});

	// Code
	$('#toolbar_code').on('click', function() {
		self.editor.func.block();
	});

	// Preview mode
	self.editor.on('mode', function(mode) {

		if (mode == 'preview') {
			$('#toolbar_previewer')
				.addClass('active')
				.closest('.ui.menu')
				.find('.item')
				.not($('#toolbar_previewer'))
				.removeClass('active');

			self.editor.$editor.hide();

			// Hide toolbar
			$('#toolbar_edit').hide();

			marked(self.editor.core.getValue(), {
				renderer: self.editor.func.renderer,
				breaks: true
			}, function(err, content) {
				$('#form_content_previewer').html(content);
				$('#form_content_previewer').show();
			});
		} else {
			$('#toolbar_edit_mode')
				.addClass('active')
				.closest('.ui.menu')
				.find('.item')
				.not($('#toolbar_edit_mode'))
				.removeClass('active');

			$('#toolbar_edit').show();
			self.editor.$editor.show();
			$('#form_content_previewer').hide();

			self.editor.core.focus();
		}
	});
	$('#toolbar_previewer').on('click', function() {
		self.editor.preview();
	});

	// Edit mode
	$('#toolbar_edit_mode').on('click', function() {
		self.editor.edit();
	});
};
