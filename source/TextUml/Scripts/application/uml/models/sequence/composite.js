var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Base, Composite;
  Base = require('./base');
  return Composite = (function(_super) {

    __extends(Composite, _super);

    function Composite(parent) {
      this.children = [];
      Composite.__super__.constructor.apply(this, arguments);
    }

    return Composite;

  })(Base);
});
