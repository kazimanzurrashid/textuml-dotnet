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
      var _this = this;
      events.on('parseStarted', function() {
        return _this.$el.val('');
      });
      events.on('parseWarning parseError', function(e) {
        var value;
        value = _this.$el.val();
        if (value) {
          value += '\n';
        }
        value += e.message;
        return _this.$el.val(value);
      });
      return events.on('parseCompleted', function(e) {
        var value;
        value = '';
        if (e.diagram) {
          value = _this.$el.val();
          if (value) {
            value += '\n';
          }
          value += 'Diagram generated successfully.';
        }
        return _this.$el.val(value);
      });
    };

    return OutputGeneratorView;

  })(Backbone.View);
});
