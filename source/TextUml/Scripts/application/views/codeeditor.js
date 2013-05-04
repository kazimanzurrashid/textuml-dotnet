var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, CodeEditorView, CodeMirror, events;
  Backbone = require('backbone');
  CodeMirror = require('codemirror');
  events = require('../events');
  require('codemirrormarkselection');
  require('codemirroractiveline');
  CodeMirror.defineMode('uml', function() {
    var Keywords;
    Keywords = /^(?:title|participant|as|alt|opt|loop|else|end)$/im;
    return {
      token: function(stream) {
        var chr, value;
        if (stream.eatSpace()) {
          return null;
        }
        chr = stream.next();
        if (chr === '\'') {
          stream.skipToEnd();
          return 'comment';
        }
        if (chr === '"') {
          stream.skipTo('"');
          return 'string';
        }
        if (/\w/.test(chr)) {
          stream.eatWhile(/\w/);
          value = stream.current();
          if (Keywords.test(value)) {
            return 'keyword';
          }
        }
      }
    };
  });
  return CodeEditorView = (function(_super) {

    __extends(CodeEditorView, _super);

    function CodeEditorView() {
      return CodeEditorView.__super__.constructor.apply(this, arguments);
    }

    CodeEditorView.prototype.el = '#code-text-area';

    CodeEditorView.prototype.initialize = function(options) {
      var _this = this;
      this.context = options.context;
      this.editor = CodeMirror.fromTextArea(this.$el.get(0), {
        mode: 'uml',
        tabSize: 2,
        indentWithTabs: true,
        lineNumbers: true,
        dragDrop: false,
        styleActiveLine: true
      });
      this.oldCode = this.editor.getValue();
      this.editor.on('change', function() {
        return _this.onCodeChanged();
      });
      this.listenTo(events, 'exampleSelected', this.onExampleSelected);
      return this.listenTo(events, 'documentChanged', this.onDocumentChanged);
    };

    CodeEditorView.prototype.onExampleSelected = function(e) {
      var code;
      code = this.editor.getValue();
      if (code) {
        code += '\n';
      }
      code += e.example.get('snippet');
      this.editor.setValue(code);
      return this.editor.focus();
    };

    CodeEditorView.prototype.onDocumentChanged = function() {
      var code;
      code = this.context.getCurrentDocumentContent();
      this.editor.setValue(code);
      return this.editor.focus();
    };

    CodeEditorView.prototype.onCodeChanged = function() {
      var newCode;
      newCode = this.editor.getValue();
      if (newCode === this.oldCode) {
        return false;
      }
      this.context.setCurrentDocumentContent(newCode);
      events.trigger('codeChanged', {
        code: newCode
      });
      return this.oldCode = newCode;
    };

    return CodeEditorView;

  })(Backbone.View);
});
