var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var ForgotPassword, ForgotPasswordView, MembershipFormmView, _ref;

  MembershipFormmView = require('./membershipform');
  ForgotPassword = require('../models/forgotpassword');
  ForgotPasswordView = (function(_super) {
    __extends(ForgotPasswordView, _super);

    function ForgotPasswordView() {
      _ref = ForgotPasswordView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ForgotPasswordView.prototype.el = '#forgot-password-form';

    ForgotPasswordView.prototype.handleError = function() {
      var message;

      message = 'An unexpected error has occurred while sending ' + 'forgot password request.';
      return this.$el.showSummaryError({
        message: message
      });
    };

    return ForgotPasswordView;

  })(MembershipFormmView);
  ForgotPasswordView.prototype.modelType = ForgotPassword;
  ForgotPasswordView.prototype.successEvent = 'passwordResetTokenRequested';
  return ForgotPasswordView;
});
