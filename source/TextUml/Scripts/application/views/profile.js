var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, ChangePassword, Helpers, ProfileView, Session, events;
  $ = require('jquery');
  Backbone = require('backbone');
  ChangePassword = require('../models/changepassword');
  Session = require('../models/session');
  Helpers = require('./helpers');
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

    ProfileView.prototype.events = {
      'submit form': 'changePassword',
      'click #sign-out-button': 'signOut'
    };

    ProfileView.prototype.initialize = function() {
      var _this = this;
      this.changePasswordForm = this.$('form');
      this.$el.modal({
        show: false
      }).on('shown', function() {
        return _this.changePasswordForm.putFocus();
      });
      return events.on('showProfile', function() {
        _this.changePasswordForm.resetFields().hideSummaryError().hideFieldErrors();
        return _this.$el.modal('show');
      });
    };

    ProfileView.prototype.changePassword = function(e) {
      var changePassword,
        _this = this;
      e.preventDefault();
      this.changePasswordForm.hideSummaryError().hideFieldErrors();
      changePassword = new ChangePassword;
      Helpers.subscribeModelInvalidEvent(changePassword, this.changePasswordForm);
      return changePassword.save(this.changePasswordForm.serializeFields(), {
        success: function() {
          _this.$el.modal('hide');
          return events.trigger('passwordChanged');
        },
        error: function(model, jqxhr) {
          var modelErrors;
          if (Helpers.hasModelErrors(jqxhr)) {
            modelErrors = Helpers.getModelErrors(jqxhr);
            if (modelErrors) {
              return _this.$el.showFieldErrors({
                errors: modelErrors
              });
            }
          }
          return _this.$el.showSummaryError({
            message: 'An unexpected error has occurred while changing' + 'your password.'
          });
        }
      });
    };

    ProfileView.prototype.signOut = function(e) {
      e.preventDefault();
      this.$el.modal('hide');
      return $.confirm({
        prompt: 'Are you sure you want to sign out?',
        ok: function() {
          return (new Session({
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
