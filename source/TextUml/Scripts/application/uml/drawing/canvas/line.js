var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Base, Kinetic, Line, LineStyle, _;

  _ = require('underscore');
  Kinetic = require('kinetic');
  Base = require('./base');
  LineStyle = require('../linestyle');
  return Line = (function(_super) {
    __extends(Line, _super);

    function Line(x, y, style, attributes) {
      this.x = x;
      this.y = y;
      this.style = style != null ? style : LineStyle.line;
      Line.__super__.constructor.call(this, attributes);
    }

    Line.prototype.draw = function(surface) {
      var attributes;

      attributes = _(this.attributes).defaults({
        points: this.getPoints()
      });
      if (this.style === LineStyle.dash) {
        attributes = _(attributes).defaults({
          dashArray: [8, 3]
        });
      }
      this.element = new Kinetic.Line(attributes);
      this.element.setListening(false);
      surface.add(this.element);
      return this;
    };

    Line.prototype.getPoints = function() {
      throw new Error('Not implemented.');
    };

    Line.prototype.getX1 = function() {
      return this.x;
    };

    Line.prototype.getY1 = function() {
      return this.y;
    };

    return Line;

  })(Base);
});
