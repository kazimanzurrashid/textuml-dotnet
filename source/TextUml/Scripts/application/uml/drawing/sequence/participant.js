var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Config, Margin, Participant, textAttributes;
  Config = require('./config');
  Composite = require('./composite');
  Margin = 30;
  textAttributes = {
    fontFamily: Config.fontFamily,
    fontSize: Config.fontSize,
    fill: Config.foreColor
  };
  return Participant = (function(_super) {

    __extends(Participant, _super);

    function Participant(model) {
      this.model = model;
      Participant.__super__.constructor.apply(this, arguments);
    }

    Participant.prototype.draw = function(context) {
      var box, height, point, text, width;
      point = context.getParticipantShapeStartPoint(this.model);
      text = context.shapeFactory.text(point.x + Margin, point.y + Margin, this.model.name, textAttributes).draw(context.surface);
      width = (Margin * 2) + text.getWidth();
      height = (Margin * 2) + text.getHeight();
      box = context.shapeFactory.rectangle(point.x, point.y, width, height, {
        stroke: Config.borderColor,
        fill: Config.backColor
      }).draw(context.surface);
      box.toBack();
      text.toFront();
      this.children.push(text, box);
      context.addShape(this);
      return this;
    };

    Participant.prototype.getLifelineStartPoint = function() {
      var x, y;
      x = this.getX1() + (this.getWidth() / 2);
      y = this.getY1() + this.getHeight();
      return {
        x: x,
        y: y
      };
    };

    return Participant;

  })(Composite);
});
