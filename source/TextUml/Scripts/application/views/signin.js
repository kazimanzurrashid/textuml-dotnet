var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Helpers, MembershipFormmView, Session, SignInView;
  MembershipFormmView = require('./membershipform');
  Session = require('../models/session');
  Helpers = require('./helpers');
  SignInView = (function(_super) {

    __extends(SignInView, _super);

    function SignInView() {
      return SignInView.__super__.constructor.apply(this, arguments);
    }

    SignInView.prototype.el = '#sign-in-form';

    SignInView.prototype.handleError = function(jqxhr) {
      var message;
      message = Helpers.hasModelErrors(jqxhr) ? 'Invalid credentials.' : 'An unexpected error has occurred while signing in.';
      return this.$el.showSummaryError({
        message: message
      });
    };

    return SignInView;

  })(MembershipFormmView);
  SignInView.prototype.modelType = Session;
  SignInView.prototype.successEvent = 'signedIn';
  return SignInView;
});
