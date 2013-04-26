var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Helpers, MembershipFormmView, SignUpView, User;
  MembershipFormmView = require('./membershipform');
  User = require('../models/user');
  Helpers = require('./helpers');
  SignUpView = (function(_super) {

    __extends(SignUpView, _super);

    function SignUpView() {
      return SignUpView.__super__.constructor.apply(this, arguments);
    }

    SignUpView.prototype.el = '#sign-up-form';

    SignUpView.prototype.handleError = function(jqxhr) {
      var modelErrors;
      if (Helpers.hasModelErrors(jqxhr)) {
        modelErrors = Helpers.getModelErrors(jqxhr);
        if (modelErrors) {
          return this.$el.showFieldErrors({
            errors: modelErrors
          });
        }
      }
      return this.$el.showSummaryError({
        message: 'An unexpected error has ' + 'occurred while signing up.'
      });
    };

    return SignUpView;

  })(MembershipFormmView);
  SignUpView.prototype.modelType = User;
  SignUpView.prototype.successEvent = 'signedUp';
  return SignUpView;
});
