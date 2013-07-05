var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Base, Kinetic, Text, _;
  _ = require('underscore');
  Kinetic = require('kinetic');
  Base = require('./base');
  return Text = (function(_super) {

    __extends(Text, _super);

    function Text(x, y, value, attributes) {
      this.x = x;
      this.y = y;
      this.value = value;
      Text.__super__.constructor.call(this, attributes);
    }

    Text.size = function(surface, value, attributes) {
      var result, text;
      text = new Text(0, 0, value, attributes).draw(surface);
      result = {
        width: text.getWidth(),
        height: text.getHeight()
      };
      text.remove();
      return result;
    };

    Text.prototype.draw = function(surface) {
      this.element = new Kinetic.Text({
        x: this.x,
        y: this.y,
        text: this.value
      });
      this.element.setAttrs(this.attributes);
      this.element.setListening(false);
      surface.add(this.element);
      return this;
    };

    return Text;

  })(Base);
});
