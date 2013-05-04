var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ForgotPassword, Validation, _, _ref;

  _ = require('underscore');
  Backbone = require('backbone');
  Validation = require('./validation');
  return ForgotPassword = (function(_super) {
    __extends(ForgotPassword, _super);

    function ForgotPassword() {
      _ref = ForgotPassword.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ForgotPassword.prototype.url = '/api/passwords/forgot';

    ForgotPassword.prototype.defaults = function() {
      return {
        email: null
      };
    };

    ForgotPassword.prototype.validate = function(attributes) {
      var errors;

      errors = {};
      if (attributes.email) {
        if (!Validation.isValidEmailFormat(attributes.email)) {
          Validation.addError(errors, 'email', 'Invalid email format.');
        }
      } else {
        Validation.addError(errors, 'email', 'Email is required.');
      }
      if (_(errors).isEmpty()) {
        return void 0;
      } else {
        return errors;
      }
    };

    return ForgotPassword;

  })(Backbone.Model);
});
