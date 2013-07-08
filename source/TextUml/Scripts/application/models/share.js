var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Share, Validation, _;
  _ = require('underscore');
  Backbone = require('backbone');
  Validation = require('./validation');
  return Share = (function(_super) {

    __extends(Share, _super);

    function Share() {
      return Share.__super__.constructor.apply(this, arguments);
    }

    Share.prototype.defaults = function() {
      return {
        email: null,
        canEdit: false
      };
    };

    Share.prototype.validate = function(attributes) {
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

    return Share;

  })(Backbone.Model);
});
