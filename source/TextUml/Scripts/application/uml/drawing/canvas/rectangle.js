var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Base, Kinetic, Rectangle, _;

  _ = require('underscore');
  Kinetic = require('kinetic');
  Base = require('./base');
  return Rectangle = (function(_super) {
    __extends(Rectangle, _super);

    function Rectangle(x, y, width, height, attributes) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      Rectangle.__super__.constructor.call(this, attributes);
    }

    Rectangle.prototype.draw = function(surface) {
      this.element = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      });
      if (!_(this.attributes).isEmpty()) {
        this.element.setAttrs(this.attributes);
      }
      this.element.setListening(false);
      surface.add(this.element);
      return this;
    };

    return Rectangle;

  })(Base);
});
