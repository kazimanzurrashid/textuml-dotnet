var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, ChangePassword, ProfileView, Session, events, helpers;
  $ = require('jquery');
  Backbone = require('backbone');
  ChangePassword = require('../models/changepassword');
  Session = require('../models/session');
  helpers = require('./helpers');
  events = require('../events');
  require('bootstrap');
  require('form');
  require('confirm');
  return ProfileView = (function(_super) {

    __extends(ProfileView, _super);

    function ProfileView() {
      return ProfileView.__super__.constructor.apply(this, arguments);
    }

    ProfileView.prototype.el = '#profile-dialog';

    ProfileView.prototype.changePasswordType = ChangePassword;

    ProfileView.prototype.sessionType = Session;

    ProfileView.prototype.events = {
      'shown': 'onDialogShown',
      'submit form': 'onChangePassword',
      'click #sign-out-button': 'onSignOut'
    };

    ProfileView.prototype.initialize = function() {
      this.changePasswordForm = this.$('form');
      this.$el.modal({
        show: false
      });
      return this.listenTo(events, 'showProfile', this.onShowProfile);
    };

    ProfileView.prototype.onShowProfile = function() {
      this.changePasswordForm.resetFields().hideSummaryError().hideFieldErrors();
      return this.$el.modal('show');
    };

    ProfileView.prototype.onDialogShown = function() {
      return this.changePasswordForm.putFocus();
    };

    ProfileView.prototype.onChangePassword = function(e) {
      var changePassword,
        _this = this;
      e.preventDefault();
      this.changePasswordForm.hideSummaryError().hideFieldErrors();
      changePassword = new this.changePasswordType;
      helpers.subscribeModelInvalidEvent(changePassword, this.changePasswordForm);
      return changePassword.save(this.changePasswordForm.serializeFields(), {
        success: function() {
          _this.$el.modal('hide');
          return events.trigger('passwordChanged');
        },
        error: function(_, jqxhr) {
          var modelErrors;
          if (helpers.hasModelErrors(jqxhr)) {
            modelErrors = helpers.getModelErrors(jqxhr);
            if (modelErrors) {
              return _this.changePasswordForm.showFieldErrors({
                errors: modelErrors
              });
            }
          }
          return _this.changePasswordForm.showSummaryError({
            message: 'An unexpected error has occurred while changing ' + 'your password.'
          });
        }
      });
    };

    ProfileView.prototype.onSignOut = function(e) {
      var _this = this;
      e.preventDefault();
      this.$el.modal('hide');
      return $.confirm({
        prompt: 'Are you sure you want to sign out?',
        ok: function() {
          return (new _this.sessionType({
            id: Date.now()
          })).destroy({
            success: function() {
              return events.trigger('signedOut');
            }
          });
        }
      });
    };

    return ProfileView;

  })(Backbone.View);
});
