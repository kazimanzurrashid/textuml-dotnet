var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Line, VerticalLine;

  Line = require('./line');
  return VerticalLine = (function(_super) {
    __extends(VerticalLine, _super);

    function VerticalLine(x, y, height, style, attributes) {
      this.height = height;
      VerticalLine.__super__.constructor.call(this, x, y, style, attributes);
    }

    VerticalLine.prototype.getPoints = function() {
      return [this.x, this.y, this.x, this.y + this.height];
    };

    VerticalLine.prototype.getHeight = function() {
      return this.height;
    };

    return VerticalLine;

  })(Line);
});
