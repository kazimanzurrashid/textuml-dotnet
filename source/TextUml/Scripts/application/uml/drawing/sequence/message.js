var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var ArrowDirection, ArrowStyle, Composite, Config, LineStyle, Message, SelfInvokingLineHeight, SelfInvokingTextMargin, getGap, textAttributes;

  Config = require('./config');
  Composite = require('./composite');
  ArrowDirection = require('../arrowdirection');
  ArrowStyle = require('../arrowstyle');
  LineStyle = require('../linestyle');
  SelfInvokingTextMargin = 10;
  SelfInvokingLineHeight = 40;
  getGap = function() {
    return Config.lineSize * 3;
  };
  textAttributes = {
    fontFamily: Config.fontFamily,
    fontSize: Config.fontSize,
    fill: Config.foreColor
  };
  return Message = (function(_super) {
    __extends(Message, _super);

    function Message(model) {
      this.model = model;
      Message.__super__.constructor.apply(this, arguments);
    }

    Message.prototype.draw = function(context) {
      var arrowDirection, arrowStyle, gap, lineStyle, receiverShape, senderShape, x, x1, x2, y;

      arrowStyle = this.model.async ? ArrowStyle.open : ArrowStyle.close;
      lineStyle = this.model.callReturn ? LineStyle.dash : LineStyle.line;
      y = context.getNextShapeStartY();
      senderShape = context.getParticipantShape(this.model.sender.name);
      receiverShape = context.getParticipantShape(this.model.receiver.name);
      gap = getGap();
      if (this.model.selfInvoking()) {
        x = senderShape.getLifelineStartPoint().x;
        if (context.isLast(senderShape.model)) {
          arrowDirection = ArrowDirection.right;
          x -= gap;
        } else {
          arrowDirection = ArrowDirection.left;
          x += gap;
        }
        this.drawSelfInvoking(context, arrowDirection, arrowStyle, lineStyle, x, y);
      } else {
        if (senderShape.getX1() < receiverShape.getX1()) {
          arrowDirection = ArrowDirection.right;
          x1 = senderShape.getLifelineStartPoint().x + gap;
          x2 = receiverShape.getLifelineStartPoint().x - gap;
        } else {
          arrowDirection = ArrowDirection.left;
          x1 = receiverShape.getLifelineStartPoint().x + gap;
          x2 = senderShape.getLifelineStartPoint().x - gap;
        }
        this.drawRegular(context, arrowDirection, arrowStyle, lineStyle, x1, x2, y);
      }
      context.addShape(this);
      return this;
    };

    Message.prototype.drawRegular = function(context, arrowDirection, arrowStyle, lineStyle, x1, x2, y) {
      var arrow, arrowAttributes, line, text, textSize, textX, width, x;

      textSize = context.shapeFactory.textSize(context.surface, this.model.name, textAttributes);
      width = x2 - x1;
      textX = x1 + (width - textSize.width) / 2;
      text = context.shapeFactory.text(textX, y, this.model.name, textAttributes).draw(context.surface);
      y += textSize.height + getGap();
      line = context.shapeFactory.horizontalLine(x1, y, width, lineStyle, {
        stroke: Config.borderColor
      }).draw(context.surface);
      x = arrowDirection === ArrowDirection.left ? x1 : x2;
      arrowAttributes = {
        stroke: Config.borderColor
      };
      if (arrowStyle === ArrowStyle.close) {
        arrowAttributes.fill = Config.borderColor;
      }
      arrow = context.shapeFactory.arrow(x, y, arrowDirection, arrowStyle, Config.arrowSize, arrowAttributes).draw(context.surface);
      return this.children.push(text, line, arrow);
    };

    Message.prototype.drawSelfInvoking = function(context, arrowDirection, arrowStyle, lineStyle, x, y) {
      var arrow, arrowAttributes, line1, line2, line3, lineWidth, text, textSize, textX;

      textSize = context.shapeFactory.textSize(context.surface, this.model.name, textAttributes);
      textX = x + SelfInvokingTextMargin / 2;
      lineWidth = textSize.width + SelfInvokingTextMargin;
      if (arrowDirection === ArrowDirection.right) {
        textX = x - textSize.width - SelfInvokingTextMargin / 2;
        lineWidth = -lineWidth;
      }
      text = context.shapeFactory.text(textX, y, this.model.name, textAttributes).draw(context.surface);
      y += textSize.height + getGap();
      line1 = context.shapeFactory.horizontalLine(x, y, lineWidth, lineStyle, {
        stroke: Config.borderColor
      }).draw(context.surface);
      line2 = context.shapeFactory.verticalLine(x + lineWidth, y, SelfInvokingLineHeight, lineStyle, {
        stroke: Config.borderColor
      }).draw(context.surface);
      line3 = context.shapeFactory.horizontalLine(x, y + SelfInvokingLineHeight, lineWidth, lineStyle, {
        stroke: Config.borderColor
      }).draw(context.surface);
      arrowAttributes = {
        stroke: Config.borderColor
      };
      if (arrowStyle === ArrowStyle.close) {
        arrowAttributes.fill = Config.borderColor;
      }
      arrow = context.shapeFactory.arrow(x, y + SelfInvokingLineHeight, arrowDirection, arrowStyle, Config.arrowSize, arrowAttributes).draw(context.surface);
      return this.children.push(text, line1, line2, line3, arrow);
    };

    return Message;

  })(Composite);
});
