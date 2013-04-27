var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Helpers, MembershipFormView, events;
  Backbone = require('backbone');
  Helpers = require('./helpers');
  events = require('../events');
  require('form');
  return MembershipFormView = (function(_super) {

    __extends(MembershipFormView, _super);

    function MembershipFormView() {
      return MembershipFormView.__super__.constructor.apply(this, arguments);
    }

    MembershipFormView.prototype.modelType = null;

    MembershipFormView.prototype.successEvent = null;

    MembershipFormView.prototype.events = {
      'submit': 'submit'
    };

    MembershipFormView.prototype.handleError = function(jqxhr) {
      throw new Error('Not implemented');
    };

    MembershipFormView.prototype.submit = function(e) {
      var model,
        _this = this;
      e.preventDefault();
      this.$el.hideSummaryError().hideFieldErrors();
      model = new this.modelType;
      Helpers.subscribeModelInvalidEvent(model, this.$el);
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
