var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Config, Lifeline, LineStyle;

  Config = require('./config');
  Composite = require('./composite');
  LineStyle = require('../linestyle');
  return Lifeline = (function(_super) {
    __extends(Lifeline, _super);

    function Lifeline(model) {
      this.model = model;
      Lifeline.__super__.constructor.apply(this, arguments);
    }

    Lifeline.prototype.draw = function(context) {
      var line, position;

      position = context.getLifelinePosition(this.model.name);
      line = context.shapeFactory.verticalLine(position.x, position.y, position.height, LineStyle.dash, {
        stroke: Config.borderColor
      }).draw(context.surface).toBack();
      this.children.push(line);
      context.addShape(this);
      return this;
    };

    return Lifeline;

  })(Composite);
});
