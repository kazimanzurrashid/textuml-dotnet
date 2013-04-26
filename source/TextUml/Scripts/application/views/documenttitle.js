var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, DocumentTitleView, events;
  Backbone = require('backbone');
  events = require('../events');
  require('form');
  require('bootstrap');
  return DocumentTitleView = (function(_super) {

    __extends(DocumentTitleView, _super);

    function DocumentTitleView() {
      return DocumentTitleView.__super__.constructor.apply(this, arguments);
    }

    DocumentTitleView.prototype.el = '#document-title-dialog';

    DocumentTitleView.prototype.events = {
      'click button': 'submit'
    };

    DocumentTitleView.prototype.initialize = function(options) {
      var _this = this;
      this.context = options.context;
      this.input = this.$('input[type="text"]');
      this.$el.modal({
        show: false
      }).on('show', function() {
        return _this.$el.hideFieldErrors();
      }).on('shown', function() {
        return _this.input.select().focus();
      });
      return events.on('showNewDocumentTitle', function() {
        _this.input.val(_this.context.getNewDocumentTitle());
        return _this.$el.modal('show');
      });
    };

    DocumentTitleView.prototype.submit = function(e) {
      var errors, title;
      e.preventDefault();
      title = this.input.val();
      if (!title) {
        errors = {
          title: ['Title is required.']
        };
        return this.$el.showFieldErrors({
          errors: errors
        });
      }
      this.context.setCurrentDocumentTitle(title);
      this.$el.modal('hide');
      return events.trigger('newDocumentTitleAssigned');
    };

    return DocumentTitleView;

  })(Backbone.View);
});
