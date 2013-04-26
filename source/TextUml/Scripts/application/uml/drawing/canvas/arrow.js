(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Arrow, ArrowDirection, ArrowStyle, Base, Kinetic;

    Kinetic = require('kinetic');
    Base = require('./base');
    ArrowDirection = require('../arrowdirection');
    ArrowStyle = require('../arrowstyle');
    return Arrow = (function(_super) {
      __extends(Arrow, _super);

      function Arrow(x, y, direction, style, size, attributes) {
        this.x = x;
        this.y = y;
        this.direction = direction != null ? direction : ArrowDirection.left;
        this.style = style != null ? style : ArrowStyle.open;
        this.size = size;
        Arrow.__super__.constructor.call(this, attributes);
      }

      Arrow.prototype.draw = function(surface) {
        var data;

        data = this.generatePath();
        this.element = new Kinetic.Path({
          data: data
        });
        this.element.setAttrs(this.attributes);
        this.element.setListening(false);
        surface.add(this.element);
        return this;
      };

      Arrow.prototype.generatePath = function() {
        var path;

        path = null;
        if (this.direction === ArrowDirection.right) {
          path = "M" + this.x + " " + this.y + " L" + (this.x - this.size) + " " + (this.y - this.size) + " ";
          if (this.style === ArrowStyle.close) {
            path += "" + (this.x - this.size) + " " + (this.y + this.size) + " Z";
          } else if (this.style === ArrowStyle.open) {
            path += "M" + this.x + " " + this.y + " L" + (this.x - this.size) + " " + (this.y + this.size);
          }
        } else if (this.direction === ArrowDirection.left) {
          path = "M" + this.x + " " + this.y + " L" + (this.x + this.size) + " " + (this.y - this.size) + " ";
          if (this.style === ArrowStyle.close) {
            path += "" + (this.x + this.size) + " " + (this.y + this.size) + " Z";
          } else if (this.style === ArrowStyle.open) {
            path += "M" + this.x + " " + this.y + " L" + (this.x + this.size) + " " + (this.y + this.size);
          }
        }
        return path;
      };

      return Arrow;

    })(Base);
  });

}).call(this);
