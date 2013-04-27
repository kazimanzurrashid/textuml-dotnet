var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ExportedDocumentView, events;
  Backbone = require('backbone');
  events = require('../events');
  require('bootstrap');
  return ExportedDocumentView = (function(_super) {

    __extends(ExportedDocumentView, _super);

    function ExportedDocumentView() {
      return ExportedDocumentView.__super__.constructor.apply(this, arguments);
    }

    ExportedDocumentView.prototype.el = '#exported-document-dialog';

    ExportedDocumentView.prototype.initialize = function() {
      var box, image,
        _this = this;
      box = this.$('.alert');
      image = this.$('img');
      this.$el.modal({
        show: false
      }).on('shown', function() {
        return box.fadeIn(400);
      }).on('hide', function() {
        return box.hide();
      });
      return events.on('documentExported', function(e) {
        image.prop('src', e.data);
        return _this.$el.modal('show');
      });
    };

    return ExportedDocumentView;

  })(Backbone.View);
});
