var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Helpers, SignUpView, User, events;
  Backbone = require('backbone');
  User = require('../models/user');
  Helpers = require('./helpers');
  events = require('../events');
  require('form');
  return SignUpView = (function(_super) {

    __extends(SignUpView, _super);

    function SignUpView() {
      return SignUpView.__super__.constructor.apply(this, arguments);
    }

    SignUpView.prototype.el = '#sign-up-form';

    SignUpView.prototype.events = {
      'submit': 'submit'
    };

    SignUpView.prototype.submit = function(e) {
      var user,
        _this = this;
      e.preventDefault();
      this.$el.hideSummaryError().hideFieldErrors();
      user = new User;
      Helpers.subscribeModelInvalidEvent(user, this.$el);
      return user.save(this.$el.serializeFields(), {
        success: function() {
          return events.trigger('signedUp');
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
            message: 'An unexpected error has ' + 'occurred while signing up.'
          });
        }
      });
    };

    return SignUpView;

  })(Backbone.View);
});
