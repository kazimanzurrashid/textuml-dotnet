var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Group;

  Composite = require('./composite');
  return Group = (function(_super) {
    __extends(Group, _super);

    function Group(parent, label, type) {
      this.label = label;
      this.type = type;
      Group.__super__.constructor.call(this, parent);
    }

    return Group;

  })(Composite);
});
