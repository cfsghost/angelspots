
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
		height: '100%'
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
		self.save();
	}

	if (enabled) {

		// Intializing auto-save
		self.saveRequired = false;
		self.state = 'ready';
		self.saveRunner = setInterval(autosave, 3000);
	} else {

		self.saveRequired = false;
		self.state = 'ready';
		clearInterval(self.saveRunner);
		self.saveRunner = null;
	}
};

Editor.prototype.load = function(content) {
	var self = this;

	self.core.setValue(content, -1);
};

Editor.prototype.save = function(callback) {
	var self = this;

	self.saveRequired = false;
	self.state = 'saving';
	self.savingRef++;

	// Disable save button
	$('#toolbar_save').addClass('disabled');

	self.emit('save', self.core.getValue(), function(err) {

		// Change status back
		self.savingRef--;
		if (self.savingRef == 0)
			self.state = 'ready';

		self.emit('saved');

		if (callback)
			callback(err);
	});
};
