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

    MembershipView.prototype.initialize = function() {
      var tabHeaders,
        _this = this;
      this.signIn = new SignInView;
      this.forgotPassword = new ForgotPasswordView;
      this.signUp = new SignUpView;
      tabHeaders = this.$el.find('a[data-toggle="tab"]').on('shown', function(e) {
        var _ref;
        if (((_ref = e.target) != null ? _ref.hash : void 0) != null) {
          return _this.$el.find(e.target.hash).putFocus();
        }
      });
      this.$el.modal({
        show: false
      }).on('show', function() {
        _this.canceled = true;
        return _this.$el.resetFields().hideSummaryError().hideFieldErrors();
      }).on('shown', function() {
        return _this.$el.putFocus();
      }).on('hidden', function() {
        if (_this.canceled && (_this.cancel != null)) {
          return _this.cancel();
        } else if (_this.ok != null) {
          return _this.ok();
        }
      });
      events.on('showMembership', function(e) {
        _this.ok = e && _(e.ok).isFunction() ? e.ok : void 0;
        _this.cancel = e && _(e.cancel).isFunction() ? e.cancel : void 0;
        tabHeaders.first().trigger('click');
        return _this.$el.modal('show');
      });
      return events.on('signedIn passwordResetTokenRequested signedUp', function() {
        _this.canceled = false;
        return _this.$el.modal('hide');
      });
    };

    return MembershipView;

  })(Backbone.View);
});
