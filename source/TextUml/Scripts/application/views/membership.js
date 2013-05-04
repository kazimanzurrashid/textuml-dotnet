var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ForgotPasswordView, MembershipView, SignInView, SignUpView, events, _;
  _ = require('underscore');
  Backbone = require('backbone');
  SignInView = require('./signin');
  ForgotPasswordView = require('./forgotpassword');
  SignUpView = require('./signup');
  events = require('../events');
  require('bootstrap');
  require('form');
  return MembershipView = (function(_super) {

    __extends(MembershipView, _super);

    function MembershipView() {
      return MembershipView.__super__.constructor.apply(this, arguments);
    }

    MembershipView.prototype.el = '#membership-dialog';

    MembershipView.prototype.signInViewType = SignInView;

    MembershipView.prototype.forgotPasswordViewType = ForgotPasswordView;

    MembershipView.prototype.signUpViewType = SignUpView;

    MembershipView.prototype.events = {
      'shown a[data-toggle="tab"]': 'onTabHeaderShown',
      'show': 'onDialogShow',
      'shown': 'onDialogShown',
      'hidden': 'onDialogHidden'
    };

    MembershipView.prototype.initialize = function() {
      this.signIn = new this.signInViewType;
      this.forgotPassword = new this.forgotPasswordViewType;
      this.signUp = new this.signUpViewType;
      this.firstTabHead = this.$('a[data-toggle="tab"]').first();
      this.$el.modal({
        show: false
      });
      this.listenTo(events, 'showMembership', this.onShowMembership);
      return this.listenTo(events, 'signedIn passwordResetTokenRequested signedUp', this.onSignedInOrPasswordResetTokenRequestedOrSignedUp);
    };

    MembershipView.prototype.onShowMembership = function(e) {
      this.ok = e && _(e.ok).isFunction() ? e.ok : void 0;
      this.cancel = e && _(e.cancel).isFunction() ? e.cancel : void 0;
      this.firstTabHead.trigger('click');
      return this.$el.modal('show');
    };

    MembershipView.prototype.onSignedInOrPasswordResetTokenRequestedOrSignedUp = function() {
      this.canceled = false;
      return this.$el.modal('hide');
    };

    MembershipView.prototype.onTabHeaderShown = function(e) {
      var _ref;
      if (((_ref = e.target) != null ? _ref.hash : void 0) == null) {
        return false;
      }
      return this.$(e.target.hash).putFocus();
    };

    MembershipView.prototype.onDialogShow = function() {
      this.canceled = true;
      return this.$el.resetFields().hideSummaryError().hideFieldErrors();
    };

    MembershipView.prototype.onDialogShown = function() {
      return this.$el.putFocus();
    };

    MembershipView.prototype.onDialogHidden = function() {
      if (this.canceled && (this.cancel != null)) {
        return this.cancel();
      } else if (this.ok != null) {
        return this.ok();
      } else {
        return false;
      }
    };

    return MembershipView;

  })(Backbone.View);
});
