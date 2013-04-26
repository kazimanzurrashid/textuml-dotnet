var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Helpers, Session, SignInView, events;
  Backbone = require('backbone');
  Session = require('../models/session');
  Helpers = require('./helpers');
  events = require('../events');
  require('form');
  return SignInView = (function(_super) {

    __extends(SignInView, _super);

    function SignInView() {
      return SignInView.__super__.constructor.apply(this, arguments);
    }

    SignInView.prototype.el = '#sign-in-form';

    SignInView.prototype.events = {
      'submit': 'submit'
    };

    SignInView.prototype.submit = function(e) {
      var session,
        _this = this;
      e.preventDefault();
      this.$el.hideSummaryError().hideFieldErrors();
      session = new Session;
      Helpers.subscribeModelInvalidEvent(session, this.$el);
      return session.save(this.$el.serializeFields(), {
        success: function() {
          return events.trigger('signedIn');
        },
        error: function(model, jqxhr) {
          var message;
          message = Helpers.hasModelErrors(jqxhr) ? 'Invalid credentials.' : 'An unexpected error has occurred while signing in.';
          return _this.$el.showSummaryError({
            message: message
          });
        }
      });
    };

    return SignInView;

  })(Backbone.View);
});
