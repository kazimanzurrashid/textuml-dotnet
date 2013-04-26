var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, CodeEditorView, CodeMirror, events, _;
  _ = require('underscore');
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
      var context, oldCode, triggerCodeChange,
        _this = this;
      context = options.context;
      this.editor = CodeMirror.fromTextArea(this.$el.get(0), {
        mode: 'uml',
        tabSize: 2,
        indentWithTabs: true,
        lineNumbers: true,
        dragDrop: false,
        styleActiveLine: true
      });
      oldCode = this.editor.getValue();
      triggerCodeChange = function() {
        var newCode;
        newCode = _this.editor.getValue();
        if (newCode === oldCode) {
          return false;
        }
        context.setCurrentDocumentContent(newCode);
        events.trigger('codeChanged', {
          code: newCode
        });
        return oldCode = newCode;
      };
      this.editor.on('change', _(triggerCodeChange).debounce(1000 * 0.7));
      events.on('exampleSelected', function(e) {
        var code;
        code = _this.editor.getValue();
        if (code) {
          code += '\n';
        }
        code += e.example.get('snippet');
        _this.editor.setValue(code);
        triggerCodeChange();
        return _this.editor.focus();
      });
      return events.on('documentChanged', function() {
        var code;
        code = context.getCurrentDocumentContent();
        _this.editor.setValue(code);
        triggerCodeChange();
        return _this.editor.focus();
      });
    };

    return CodeEditorView;

  })(Backbone.View);
});
