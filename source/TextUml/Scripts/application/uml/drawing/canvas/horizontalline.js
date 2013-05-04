var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var HorizontalLine, Line;

  Line = require('./line');
  return HorizontalLine = (function(_super) {
    __extends(HorizontalLine, _super);

    function HorizontalLine(x, y, width, style, attributes) {
      this.width = width;
      HorizontalLine.__super__.constructor.call(this, x, y, style, attributes);
    }

    HorizontalLine.prototype.getPoints = function() {
      return [this.x, this.y, this.x + this.width, this.y];
    };

    HorizontalLine.prototype.getWidth = function() {
      return this.width;
    };

    return HorizontalLine;

  })(Line);
});
