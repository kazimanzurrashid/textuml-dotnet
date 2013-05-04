var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, CodeEditorView, EditorView, OutputGeneratorView, Parser, events;
  Backbone = require('backbone');
  CodeEditorView = require('./codeeditor');
  OutputGeneratorView = require('./outputgenerator');
  Parser = require('../uml/language/sequence/parser');
  events = require('../events');
  return EditorView = (function(_super) {

    __extends(EditorView, _super);

    function EditorView() {
      return EditorView.__super__.constructor.apply(this, arguments);
    }

    EditorView.prototype.el = '#editor-container';

    EditorView.prototype.codeEditorViewType = CodeEditorView;

    EditorView.prototype.outputGeneratorViewType = OutputGeneratorView;

    EditorView.prototype.parserType = Parser;

    EditorView.prototype.initialize = function(options) {
      var callbacks, context;
      context = options.context;
      this.code = new this.codeEditorViewType({
        context: context
      });
      this.output = new this.outputGeneratorViewType;
      callbacks = {
        onStart: function() {
          return events.trigger('parseStarted');
        },
        onWarning: function(message) {
          return events.trigger('parseWarning', {
            message: message
          });
        },
        onError: function(exception) {
          return events.trigger('parseError', {
            message: exception.message
          });
        },
        onComplete: function(diagram) {
          return events.trigger('parseCompleted', {
            diagram: diagram
          });
        }
      };
      this.parser = new this.parserType({
        callbacks: callbacks
      });
      return this.listenTo(events, 'codeChanged', this.onCodeChanged);
    };

    EditorView.prototype.onCodeChanged = function(e) {
      return this.parser.parse(e.code);
    };

    return EditorView;

  })(Backbone.View);
});
