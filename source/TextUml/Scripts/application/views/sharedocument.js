﻿var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Helpers, Share, ShareDocumentView, Shares, events, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  Helpers = require('./helpers');
  Share = require('../models/share');
  Shares = require('../models/shares');
  events = require('../events');
  return ShareDocumentView = (function(_super) {

    __extends(ShareDocumentView, _super);

    function ShareDocumentView() {
      return ShareDocumentView.__super__.constructor.apply(this, arguments);
    }

    ShareDocumentView.prototype.el = '#document-share-dialog';

    ShareDocumentView.prototype.events = {
      'shown': 'onDialogShown',
      'submit .new-share': 'onAdd',
      'submit .share-list .edit-share': 'onRemove',
      'click .modal-footer .btn-primary': 'onSave'
    };

    ShareDocumentView.prototype.initialize = function(options) {
      this.context = options.context;
      this.container = this.$('.modal-body > .share-list');
      this.template = _(this.$('#share-item-template').html()).template();
      this.$el.modal({
        show: false
      });
      return this.listenTo(events, 'shareDocument', this.onShare);
    };

    ShareDocumentView.prototype.render = function() {
      var _this = this;
      this.container.empty();
      this.collection.each(function(model) {
        return $(_this.template(model.toJSON())).appendTo(_this.container);
      });
      return this;
    };

    ShareDocumentView.prototype.onDialogShown = function() {
      return this.$el.putFocus();
    };

    ShareDocumentView.prototype.onAdd = function(e) {
      var form, share;
      e.preventDefault();
      form = $(e.currentTarget);
      share = new Share;
      Helpers.subscribeModelInvalidEvent(share, form);
      if (!share.set(form.serializeFields(), {
        validate: true
      })) {
        return false;
      }
      $(this.template(share.toJSON())).hide().prependTo(this.container).fadeIn();
      return form.resetFields().putFocus();
    };

    ShareDocumentView.prototype.onRemove = function(e) {
      e.preventDefault();
      return $(e.currentTarget).fadeOut(function() {
        return $(this).remove();
      });
    };

    ShareDocumentView.prototype.onSave = function(e) {
      var records, valid,
        _this = this;
      e.preventDefault();
      records = [];
      this.container.find('.edit-share').each(function() {
        return records.push({
          model: new Share,
          form: $(this)
        });
      });
      valid = _(records).chain().map(function(r) {
        Helpers.subscribeModelInvalidEvent(r.model, r.form);
        return r.model.set(r.form.serializeFields(), {
          validate: true
        });
      }).all().value();
      if (!valid) {
        return false;
      }
      this.collection.reset({
        silent: true
      });
      this.collection.set(_(records).map(function(r) {
        return r.model;
      }));
      return this.collection.update({
        success: function() {
          return _this.$el.modal('hide');
        }
      });
    };

    ShareDocumentView.prototype.onShare = function() {
      var _this = this;
      if (!this.context.isUserSignedIn()) {
        return events.trigger('showMembership');
      }
      if (this.context.isCurrentDocumentNew()) {
        return events.trigger('showNewDocumentTitle');
      }
      if (!this.context.isCurrentDocumentOwned()) {
        return $.showErrorbar('Only document owner can share a document.');
      }
      return Shares.get(this.context.getCurrentDocumentId(), function(collection) {
        _this.collection = collection;
        _this.render();
        return _this.$el.modal('show');
      });
    };

    return ShareDocumentView;

  })(Backbone.View);
});