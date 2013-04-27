var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, CanvasView, Renderer, events;
  $ = require('jquery');
  Backbone = require('backbone');
  Renderer = require('../uml/drawing/sequence/renderer');
  events = require('../events');
  require('flashbar');
  return CanvasView = (function(_super) {

    __extends(CanvasView, _super);

    function CanvasView() {
      return CanvasView.__super__.constructor.apply(this, arguments);
    }

    CanvasView.prototype.el = '#canvas-container';

    CanvasView.prototype.initialize = function(options) {
      var context,
        _this = this;
      context = options.context;
      this.renderer = new Renderer;
      events.on('parseStarted', function() {
        return _this.renderer.clear();
      });
      events.on('parseCompleted', function(e) {
        var title, _ref;
        title = null;
        if (e.diagram) {
          title = (_ref = e.diagram.title) != null ? _ref.text : void 0;
          _this.renderer.render(e.diagram);
        }
        return context.setCurrentDocumentTitle(title);
      });
      return events.on('exportDocument', function() {
        var data;
        try {
          data = _this.renderer.serialize();
          return events.trigger('documentExported', {
            data: data
          });
        } catch (exception) {
          return $.showErrorbar(exception.message);
        }
      });
    };

    return CanvasView;

  })(Backbone.View);
});
