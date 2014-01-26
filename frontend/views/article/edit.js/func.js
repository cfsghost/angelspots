
var Func = function(editor) {
	var self = this;

	self.editor = editor;

	// Initializing Marked
	self.renderer = new marked.Renderer();
	self.renderer.table = function(header, body) {
		return '<table class=\"ui table segment\">' +
			'<thead>' + header + '</thead>' +
			'<tbody>' + body + '</tbody>' +
			'</table>';
	};

	self.renderer.hr = function() {
		return '<div class=\"ui divider\"></div>';
	};

	self.renderer.blockquote = function(content) {
		return '<div class=\"ui message\">' + content + '</div>';
	};

	self.renderer.code = function(code, lang) {
		return '<div class=\"ui message\"><pre><code class=\"lang-' + lang + '\">' + hljs.highlightAuto(code).value + '</code></pre></div>';
	};

	// Initializing highlight
	hljs.initHighlightingOnLoad();
};

Func.prototype.markup = function(head, end, individual) {
	var orig = editor.getSelection();
	var content = orig.replace(/^\n*(\S*(\n+\S+)*)\n*$/, "$1");
	var prefix = /^\n+/.exec(orig) || '';
	var postfix = /\n+$/.exec(orig) || '';

	if (individual && prefix == '') {
		prefix = '\n';
	}

	if (individual && postfix == '') {
		postfix = '\n';
	}

	self.core.replaceSelection(prefix + head + content + end + postfix);
};

Func.prototype.focus = function() {
	this.editor.core.focus();
};

Func.prototype.save = function(callback) {
	var self = this;

	self.editor.save(callback);
};

Func.prototype.bold = function() {
	var self = this;

	self.markup('**', '**');
	self.focus();
};

Func.prototype.italic = function() {
	var self = this;

	self.markup('*', '*');
	self.editor.core.replaceSelection('*' + self.editor.core.getSelection() + '*');
	self.focus();
};

Func.prototype.underline = function() {
	var self = this;

	self.markup('<u>', '</u>');
	self.focus();
};

Func.prototype.strikeThrough = function() {
	var self = this;

	self.markup('~~', '~~');
	self.focus();
};

Func.prototype.link = function() {
	var self = this;

	self.editor.core.replaceSelection('[' + self.editor.core.getSelection() + '](http://)');
	self.focus();
};

Func.prototype.blockquote = function() {
	var self = this;

	self.markup('>', '\n', true);
	self.focus();
};

Func.prototype.block = function() {
	var self = this;

	self.markup('```\n', '\n```', true);
	self.focus();
};
