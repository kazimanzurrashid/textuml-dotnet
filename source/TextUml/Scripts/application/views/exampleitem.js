var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ExampleListItemView;
  Backbone = require('backbone');
  return ExampleListItemView = (function(_super) {

    __extends(ExampleListItemView, _super);

    function ExampleListItemView() {
      return ExampleListItemView.__super__.constructor.apply(this, arguments);
    }

    ExampleListItemView.prototype.tagName = 'li';

    ExampleListItemView.prototype.initialize = function(options) {
      this.template = options.template;
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.model, 'remove destroy', this.remove);
    };

    ExampleListItemView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    };

    ExampleListItemView.prototype.remove = function(notify) {
      var _this = this;
      if (notify == null) {
        notify = true;
      }
      if (!notify) {
        return ExampleListItemView.__super__.remove.apply(this, arguments);
      }
      this.trigger('removing');
      this.$el.fadeOut(function() {
        return ExampleListItemView.__super__.remove.apply(_this, arguments);
      });
      return this;
    };

    return ExampleListItemView;

  })(Backbone.View);
});
