var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Config, GroupHeader, LabelMargin, LineStyle, textAttributes;

  Config = require('./config');
  Composite = require('./composite');
  LineStyle = require('../linestyle');
  LabelMargin = 8;
  textAttributes = {
    fontFamily: Config.fontFamily,
    fontSize: Config.fontSize,
    fill: Config.foreColor
  };
  return GroupHeader = (function(_super) {
    __extends(GroupHeader, _super);

    function GroupHeader(x, y, showType, model) {
      this.x = x;
      this.y = y;
      this.showType = showType;
      this.model = model;
      GroupHeader.__super__.constructor.apply(this, arguments);
    }

    GroupHeader.prototype.draw = function(context) {
      var label, labelText, line1, line2, type, typeText, x, y;

      x = this.x;
      y = this.y;
      type = this.model.type;
      label = this.model.label;
      typeText = context.shapeFactory.text(x + LabelMargin, y + LabelMargin, type, textAttributes).draw(context.surface);
      this.children.push(typeText);
      line1 = context.shapeFactory.verticalLine(typeText.getX2() + LabelMargin, y, typeText.getY2() - y + LabelMargin, LineStyle.line, {
        stroke: Config.borderColor
      }).draw(context.surface);
      this.children.push(line1);
      line2 = context.shapeFactory.horizontalLine(x, typeText.getY2() + LabelMargin, typeText.getX2() - x + LabelMargin, LineStyle.line, {
        stroke: Config.borderColor
      }).draw(context.surface);
      this.children.push(line2);
      if (label) {
        labelText = context.shapeFactory.text(line1.getX2() + LabelMargin, y + LabelMargin, "[" + label + "]", textAttributes).draw(context.surface);
        this.children.push(labelText);
      }
      if (!this.showType) {
        typeText.hide();
        line1.hide();
        line2.hide();
      }
      context.addShape(this);
      return this;
    };

    return GroupHeader;

  })(Composite);
});
