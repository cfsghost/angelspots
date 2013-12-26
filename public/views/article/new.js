
App.require('Article', function() {
	var article = App.Engine('Article');

	var editor = new EpicEditor({
		container: 'form_content_editor',
		theme: {
			base: '/themes/base/epiceditor.css',
			preview: '/themes/preview/github.css',
			editor: '/themes/editor/epic-light.css'
		},
		autogrow: true
	}).load();

});
