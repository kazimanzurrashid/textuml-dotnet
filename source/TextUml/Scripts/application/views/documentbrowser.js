var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, DocumentBrowserView, DocumentListView, events;
  Backbone = require('backbone');
  DocumentListView = require('./documentlist');
  events = require('../events');
  require('bootstrap');
  return DocumentBrowserView = (function(_super) {

    __extends(DocumentBrowserView, _super);

    function DocumentBrowserView() {
      return DocumentBrowserView.__super__.constructor.apply(this, arguments);
    }

    DocumentBrowserView.prototype.el = '#document-browser-dialog';

    DocumentBrowserView.prototype.listViewType = DocumentListView;

    DocumentBrowserView.prototype.events = {
      'show': 'onDiaglogShow',
      'hidden': 'onDialogHidden',
      'click .btn-primary': 'onSubmit'
    };

    DocumentBrowserView.prototype.initialize = function(options) {
      this.list = new this.listViewType({
        collection: options.context.documents
      });
      this.submitButton = this.$('.btn-primary');
      this.$el.modal({
        show: false
      });
      this.listenTo(events, 'showDocuments', this.onShowDocuments);
      this.listenTo(this.list, 'selected', this.onDocumentSelected);
      return this.listenTo(this.list, 'opened', this.onDocumentOpened);
    };

    DocumentBrowserView.prototype.onShowDocuments = function(e) {
      this.cancel = e.cancel;
      return this.$el.modal('show');
    };

    DocumentBrowserView.prototype.onDiaglogShow = function() {
      this.canceled = true;
      this.list.scrollToTop();
      this.list.resetSelection();
      return this.submitButton.prop('disabled', true);
    };

    DocumentBrowserView.prototype.onDialogHidden = function() {
      if (!this.canceled) {
        return false;
      }
      return typeof this.cancel === "function" ? this.cancel() : void 0;
    };

    DocumentBrowserView.prototype.onDocumentSelected = function() {
      return this.submitButton.prop('disabled', false);
    };

    DocumentBrowserView.prototype.onDocumentOpened = function() {
      return this.submitButton.trigger('click');
    };

    DocumentBrowserView.prototype.onSubmit = function(e) {
      e.preventDefault();
      this.canceled = false;
      this.$el.modal('hide');
      return events.trigger('documentSelected', {
        id: this.list.getSelectedId()
      });
    };

    return DocumentBrowserView;

  })(Backbone.View);
});
