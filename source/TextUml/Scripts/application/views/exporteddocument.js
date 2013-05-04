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

    ExportedDocumentView.prototype.events = {
      'shown': 'onDialogShown',
      'hide': 'onDialogHide'
    };

    ExportedDocumentView.prototype.initialize = function() {
      this.messageBox = this.$('.alert');
      this.image = this.$('img');
      this.$el.modal({
        show: false
      });
      return this.listenTo(events, 'documentExported', this.onDocumentExported);
    };

    ExportedDocumentView.prototype.onDocumentExported = function(e) {
      this.image.prop('src', e.data);
      return this.$el.modal('show');
    };

    ExportedDocumentView.prototype.onDialogShown = function() {
      return this.messageBox.fadeIn(400);
    };

    ExportedDocumentView.prototype.onDialogHide = function() {
      return this.messageBox.hide();
    };

    return ExportedDocumentView;

  })(Backbone.View);
});
