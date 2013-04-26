var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, ChangePassword, Validation, _;
  _ = require('underscore');
  Backbone = require('backbone');
  Validation = require('./validation');
  return ChangePassword = (function(_super) {

    __extends(ChangePassword, _super);

    function ChangePassword() {
      return ChangePassword.__super__.constructor.apply(this, arguments);
    }

    ChangePassword.prototype.url = function() {
      return '/api/passwords/change';
    };

    ChangePassword.prototype.defaults = function() {
      return {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      };
    };

    ChangePassword.prototype.validate = function(attributes) {
      var errors;
      errors = {};
      if (!attributes.oldPassword) {
        Validation.addError(errors, 'oldPassword', 'Old password is required.');
      }
      if (attributes.newPassword) {
        if (!Validation.isValidPasswordLength(attributes.newPassword)) {
          Validation.addError(errors, 'newPassword', 'New password length ' + 'must be between 6 to 64 characters.');
        }
      } else {
        Validation.addError(errors, 'newPassword', 'New password is required.');
      }
      if (attributes.confirmPassword) {
        if (attributes.newPassword && attributes.confirmPassword !== attributes.newPassword) {
          Validation.addError(errors, 'confirmPassword', 'New password and ' + 'confirmation password do not match.');
        }
      } else {
        Validation.addError(errors, 'confirmPassword', 'Confirm password is ' + 'required.');
      }
      if (_(errors).isEmpty()) {
        return void 0;
      } else {
        return errors;
      }
    };

    return ChangePassword;

  })(Backbone.Model);
});
