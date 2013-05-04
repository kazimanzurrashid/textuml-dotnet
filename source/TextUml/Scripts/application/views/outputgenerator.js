var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, OutputGeneratorView, events;
  Backbone = require('backbone');
  events = require('../events');
  return OutputGeneratorView = (function(_super) {

    __extends(OutputGeneratorView, _super);

    function OutputGeneratorView() {
      return OutputGeneratorView.__super__.constructor.apply(this, arguments);
    }

    OutputGeneratorView.prototype.el = '#output-text-area';

    OutputGeneratorView.prototype.initialize = function() {
      this.listenTo(events, 'parseStarted', this.onParseStarted);
      this.listenTo(events, 'parseWarning parseError', this.onParseWarningOrError);
      return this.listenTo(events, 'parseCompleted', this.onParseCompleted);
    };

    OutputGeneratorView.prototype.onParseStarted = function() {
      return this.$el.val('');
    };

    OutputGeneratorView.prototype.onParseWarningOrError = function(e) {
      var value;
      value = this.$el.val();
      if (value) {
        value += '\n';
      }
      value += e.message;
      return this.$el.val(value);
    };

    OutputGeneratorView.prototype.onParseCompleted = function(e) {
      var value;
      if ((e != null ? e.diagram : void 0) == null) {
        return false;
      }
      value = this.$el.val();
      if (value) {
        value += '\n';
      }
      value += 'Diagram generated successfully.';
      return this.$el.val(value);
    };

    return OutputGeneratorView;

  })(Backbone.View);
});
