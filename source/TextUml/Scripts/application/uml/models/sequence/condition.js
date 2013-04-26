var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Condition, Group, _;
  _ = require('underscore');
  Composite = require('./composite');
  Group = require('./group');
  return Condition = (function(_super) {

    __extends(Condition, _super);

    function Condition() {
      return Condition.__super__.constructor.apply(this, arguments);
    }

    Condition.prototype.createIfGroup = function(label) {
      return new Group(this, label);
    };

    Condition.prototype.addElseGroup = function(label) {
      return new Group(this, label);
    };

    Condition.prototype.getIfGroup = function() {
      return _(this.children).first();
    };

    Condition.prototype.getElseGroups = function() {
      return _(this.children).rest();
    };

    return Condition;

  })(Composite);
});
