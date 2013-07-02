var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, DocumentListEditItemView, DocumentListItemView, _;
  $ = require('jquery');
  _ = require('underscore');
  DocumentListItemView = require('./documentlistitem');
  return DocumentListEditItemView = (function(_super) {

    __extends(DocumentListEditItemView, _super);

    function DocumentListEditItemView() {
      return DocumentListEditItemView.__super__.constructor.apply(this, arguments);
    }

    DocumentListEditItemView.prototype.events = {
      'dblclick .display span': 'onEdit',
      'click [data-command="delete"]': 'onDestroy',
      'keydown input[type="text"]': 'onUpdateOrCancel',
      'blur input[type="text"]': 'onCancel'
    };

    DocumentListEditItemView.prototype.showDisplay = function() {
      this.$('.edit').hide();
      return this.$('.display').show();
    };

    DocumentListEditItemView.prototype.showEdit = function() {
      this.$('.display').hide();
      return this.$('.edit').show().find('input[type="text"]').val(this.model.get('title')).select().focus();
    };

    DocumentListEditItemView.prototype.onEdit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return this.showEdit();
    };

    DocumentListEditItemView.prototype.onCancel = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return this.showDisplay();
    };

    DocumentListEditItemView.prototype.onUpdateOrCancel = function(e) {
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
      } else {
        return true;
      }
    };

    DocumentListEditItemView.prototype.onDestroy = function(e) {
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

    return DocumentListEditItemView;

  })(DocumentListItemView);
});
