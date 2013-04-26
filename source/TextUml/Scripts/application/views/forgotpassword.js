var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ForgotPassword, ForgotPasswordView, Helpers, events;
  Backbone = require('backbone');
  ForgotPassword = require('../models/forgotpassword');
  Helpers = require('./helpers');
  events = require('../events');
  require('form');
  return ForgotPasswordView = (function(_super) {

    __extends(ForgotPasswordView, _super);

    function ForgotPasswordView() {
      return ForgotPasswordView.__super__.constructor.apply(this, arguments);
    }

    ForgotPasswordView.prototype.el = '#forgot-password-form';

    ForgotPasswordView.prototype.events = {
      'submit': 'submit'
    };

    ForgotPasswordView.prototype.submit = function(e) {
      var forgotPassword,
        _this = this;
      e.preventDefault();
      this.$el.hideSummaryError().hideFieldErrors();
      forgotPassword = new ForgotPassword;
      Helpers.subscribeModelInvalidEvent(forgotPassword, this.$el);
      return forgotPassword.save(this.$el.serializeFields(), {
        success: function() {
          return events.trigger('passwordResetTokenRequested');
        },
        error: function() {
          var message;
          message = 'An unexpected error has occurred while sending ' + 'forgot password request.';
          return _this.$el.showSummaryError({
            message: message
          });
        }
      });
    };

    return ForgotPasswordView;

  })(Backbone.View);
});
