var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Example, _ref;

  Backbone = require('backbone');
  return Example = (function(_super) {
    __extends(Example, _super);

    function Example() {
      _ref = Example.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Example.prototype.defaults = function() {
      return {
        display: null,
        snippet: null
      };
    };

    return Example;

  })(Backbone.Model);
});
