var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, MembershipFormView, events, helpers, _ref;

  Backbone = require('backbone');
  helpers = require('./helpers');
  events = require('../events');
  require('form');
  return MembershipFormView = (function(_super) {
    __extends(MembershipFormView, _super);

    function MembershipFormView() {
      _ref = MembershipFormView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MembershipFormView.prototype.modelType = null;

    MembershipFormView.prototype.successEvent = null;

    MembershipFormView.prototype.events = {
      'submit': 'onSubmit'
    };

    MembershipFormView.prototype.handleError = function() {};

    MembershipFormView.prototype.onSubmit = function(e) {
      var model,
        _this = this;

      e.preventDefault();
      this.$el.hideSummaryError().hideFieldErrors();
      model = new this.modelType;
      helpers.subscribeModelInvalidEvent(model, this.$el);
      return model.save(this.$el.serializeFields(), {
        success: function() {
          return events.trigger(_this.successEvent);
        },
        error: function(_, jqxhr) {
          return _this.handleError(jqxhr);
        }
      });
    };

    return MembershipFormView;

  })(Backbone.View);
});
