var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, DocumentListItemView, helpers, _;
  _ = require('underscore');
  Backbone = require('backbone');
  helpers = require('./helpers');
  return DocumentListItemView = (function(_super) {

    __extends(DocumentListItemView, _super);

    function DocumentListItemView() {
      return DocumentListItemView.__super__.constructor.apply(this, arguments);
    }

    DocumentListItemView.prototype.tagName = 'li';

    DocumentListItemView.prototype.initialize = function(options) {
      this.template = options.template;
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.model, 'destroy', this.remove);
    };

    DocumentListItemView.prototype.render = function() {
      var attributes;
      attributes = _(this.model.toJSON()).extend({
        lastUpdatedInRelativeTime: function() {
          return helpers.formatAsRelativeTime(this.updatedAt);
        },
        lastUpdatedInHumanizeTime: function() {
          return helpers.formatAsHumanizeTime(this.updatedAt);
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

    return DocumentListItemView;

  })(Backbone.View);
});
