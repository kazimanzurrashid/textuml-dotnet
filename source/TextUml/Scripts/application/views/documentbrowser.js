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

    DocumentBrowserView.prototype.events = {
      'click .btn-primary': 'submit'
    };

    DocumentBrowserView.prototype.initialize = function(options) {
      var context,
        _this = this;
      context = options.context;
      this.list = new DocumentListView({
        collection: context.documents
      });
      this.listenTo(this.list, 'selected', function() {
        return _this.submitButton.prop('disabled', false);
      });
      this.listenTo(this.list, 'opened', function() {
        return _this.submitButton.trigger('click');
      });
      this.submitButton = this.$('.btn-primary');
      this.$el.modal({
        show: false
      }).on('show', function() {
        _this.canceled = true;
        _this.list.scrollToTop();
        _this.list.resetSelection();
        return _this.submitButton.prop('disabled', true);
      }).on('hidden', function() {
        if (_this.canceled) {
          return _this.cancel();
        }
      });
      return events.on('showDocuments', function(e) {
        _this.cancel = e.cancel;
        return _this.$el.modal('show');
      });
    };

    DocumentBrowserView.prototype.submit = function(e) {
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
