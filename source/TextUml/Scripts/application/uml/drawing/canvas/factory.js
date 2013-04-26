
define(function(require) {
  var Arrow, Factory, HorizontalLine, Rectangle, Text, VerticalLine;
  Rectangle = require('./rectangle');
  Text = require('./text');
  VerticalLine = require('./verticalline');
  HorizontalLine = require('./horizontalline');
  Arrow = require('./arrow');
  return Factory = (function() {

    function Factory() {}

    Factory.prototype.rectangle = function(x, y, width, height, attributes) {
      return new Rectangle(x, y, width, height, attributes);
    };

    Factory.prototype.text = function(x, y, value, attributes) {
      return new Text(x, y, value, attributes);
    };

    Factory.prototype.verticalLine = function(x, y, height, style, attributes) {
      return new VerticalLine(x, y, height, style, attributes);
    };

    Factory.prototype.horizontalLine = function(x, y, width, style, attributes) {
      return new HorizontalLine(x, y, width, style, attributes);
    };

    Factory.prototype.arrow = function(x, y, direction, style, size, attributes) {
      return new Arrow(x, y, direction, style, size, attributes);
    };

    Factory.prototype.textSize = function(surface, value, attributes) {
      return Text.size(surface, value, attributes);
    };

    return Factory;

  })();
});
