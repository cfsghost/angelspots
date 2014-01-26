
var Editor = function(selector) {
	var self = this;

	self.state = 'initialize';
	self.func = new Func(self);
	self.toolbar = new Toolbar(self);
	self.$editor = $(selector);

	// Initializing editor engine
	self.core = CodeMirror(self.$editor[0], {
		mode: 'markdown',
		theme: 'base16-light',
		lineWrapping: true,
		dragDrop: false
	});

	self.core.setSize('100%', '100%');

	self.core.on('change', function() {
		if (self.state == 'ready')
			$('#toolbar_save').removeClass('disabled');

		self.saveRequired = true;
	});

	// Initializing editor
	self.$editor.css({
		height: '100%',
		padding: '0px'
	});

	// Initializing previewer
	$('#form_content_previewer').css({
		padding: '30px'
	});

	// Autosave implementation
	self.saveRequired = false;
	self.saveRunner;
	self.savingRef = 0;
};

jQuery.extend(Editor.prototype, jQuery.EventEmitter);

Editor.prototype.enabledAutosave = function(enabled) {
	var self = this;

	function autosave() {

		if (!self.saveRequired)
			return;

		if (self.state == 'saving')
			return;

		// Saving it right now
		self.func.save(function(err, doc) {
		});
	}

	if (enabled) {

		// Intializing auto-save
		self.saveRequired = false;
		self.state = 'ready';
		self.saveRunner = setInterval(autosave, 3000);
	}
};

Editor.prototype.load = function(content) {
	var self = this;

	self.core.setValue(content, -1);
};

Editor.prototype.save = function(callback) {
	var self = this;

	self.savingRef++;
	self.saveRequired = false;
	self.state = 'saving';

	// Disable save button
	$('#toolbar_save').addClass('disabled');

	self.emit('save', self.core.getValue(), function(err) {

		// Change status back
		self.savingRef--;
		if (self.savingRef == 0)
			self.state = 'ready';

		callback(err);
	});
};
