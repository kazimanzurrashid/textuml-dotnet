var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, DocumentListItemView, Helpers, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  Helpers = require('./helpers');
  return DocumentListItemView = (function(_super) {

    __extends(DocumentListItemView, _super);

    function DocumentListItemView() {
      return DocumentListItemView.__super__.constructor.apply(this, arguments);
    }

    DocumentListItemView.prototype.tagName = 'li';

    DocumentListItemView.prototype.events = {
      'dblclick .display span': 'edit',
      'click [data-command="delete"]': 'destroy',
      'keydown input[type="text"]': 'updateOrCancel',
      'blur input[type="text"]': 'cancel'
    };

    DocumentListItemView.prototype.initialize = function(options) {
      this.template = options.template;
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.model, 'remove destroy', this.remove);
    };

    DocumentListItemView.prototype.render = function() {
      var attributes;
      attributes = _(this.model.toJSON()).extend({
        lastUpdatedInRelativeTime: function() {
          return Helpers.formatAsRelativeTime(this.updatedAt);
        },
        lastUpdatedInHumanizeTime: function() {
          return Helpers.formatAsHumanizeTime(this.updatedAt);
        }
      });
      this.$el.html(this.template(attributes));
      return this;
    };

    DocumentListItemView.prototype.remove = function(notify) {
      var _this = this;
      if (notify == null) {
        notify = true;
      }
      if (!notify) {
        return DocumentListItemView.__super__.remove.apply(this, arguments);
      }
      this.trigger('removing');
      this.$el.fadeOut(function() {
        return DocumentListItemView.__super__.remove.apply(_this, arguments);
      });
      return this;
    };

    DocumentListItemView.prototype.edit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return this.showEdit();
    };

    DocumentListItemView.prototype.cancel = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return this.showDisplay();
    };

    DocumentListItemView.prototype.updateOrCancel = function(e) {
      var title;
      e.stopPropagation();
      if (e.which === 13) {
        e.preventDefault();
        title = $(e.currentTarget).val();
        if (title && title !== this.model.get('title')) {
          this.model.save({
            title: title
          });
        }
        return this.showDisplay();
      } else if (e.which === 27) {
        e.preventDefault();
        return this.showDisplay();
      }
    };

    DocumentListItemView.prototype.destroy = function(e) {
      var _this = this;
      e.preventDefault();
      e.stopPropagation();
      return $.confirm({
        prompt: 'Are you sure you want to delete ' + ("<strong>" + (this.model.get('title')) + "</strong>?"),
        ok: function() {
          return _this.model.destroy();
        }
      });
    };

    DocumentListItemView.prototype.showDisplay = function() {
      this.$('.edit').hide();
      return this.$('.display').show();
    };

    DocumentListItemView.prototype.showEdit = function() {
      this.$('.display').hide();
      return this.$('.edit').show().find('input[type="text"]').val(this.model.get('title')).select().focus();
    };

    return DocumentListItemView;

  })(Backbone.View);
});
