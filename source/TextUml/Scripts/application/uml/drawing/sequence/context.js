
define(function(require) {
  var CompositeModel, ConditionModel, Config, Context, GroupModel, Lifeline, MessageMargin, MessageModel, PaperMargin, Participant, ShapeMargin, _;
  _ = require('underscore');
  Config = require('./config');
  Participant = require('./participant');
  Lifeline = require('./lifeline');
  CompositeModel = require('../../models/sequence/composite');
  ConditionModel = require('../../models/sequence/condition');
  GroupModel = require('../../models/sequence/group');
  MessageModel = require('../../models/sequence/message');
  PaperMargin = 80;
  ShapeMargin = 40;
  MessageMargin = 10;
  return Context = (function() {

    function Context(diagram, surface, shapeFactory) {
      this.diagram = diagram;
      this.surface = surface;
      this.shapeFactory = shapeFactory;
      this.shapes = [];
      this.streamlinedMessages = this.getStreamLinedMessages(diagram.commands);
      this.totalNesting = this.getNestingLevel();
    }

    Context.prototype.getStreamLinedMessages = function(commands) {
      var messages,
        _this = this;
      messages = [];
      _(commands).each(function(c) {
        if (c instanceof MessageModel) {
          return messages.push(c);
        } else if (c instanceof CompositeModel) {
          return _(_this.getStreamLinedMessages(c.children)).each(function(m) {
            return messages.push(m);
          });
        } else {
          return false;
        }
      });
      return messages;
    };

    Context.prototype.getNestingLevel = function(commands) {
      var level,
        _this = this;
      level = 0;
      if (!commands) {
        commands = this.diagram.commands;
      }
      _(commands).chain().filter(function(c) {
        return c instanceof CompositeModel;
      }).each(function(c) {
        var result;
        result = 1;
        if (c instanceof ConditionModel) {
          result += _this.getNestingLevel(c.getIfGroup().children);
          level = Math.max(result, level);
          return _(c.getElseGroups()).each(function(g) {
            result += _this.getNestingLevel(g.children);
            return level = Math.max(result, level);
          });
        } else if (c instanceof GroupModel) {
          result += _this.getNestingLevel(c.children);
          return level = Math.max(result, level);
        } else {
          return false;
        }
      });
      return level;
    };

    Context.prototype.getXMargin = function(nestingLevel) {
      var x;
      x = PaperMargin;
      if (nestingLevel) {
        x += ShapeMargin * nestingLevel;
      }
      return x;
    };

    Context.prototype.isLast = function(participant) {
      var result;
      result = _(this.diagram.participants).last() === participant;
      return result;
    };

    Context.prototype.getTitleShapeStartPoint = function(title, attrs) {
      var leftMostShapeX, point, rightMostShapeX, size, width, x;
      leftMostShapeX = _(this.shapes).chain().map(function(s) {
        return s.getX1();
      }).sortBy(function(v) {
        return v;
      }).first().value();
      rightMostShapeX = _(this.shapes).chain().map(function(s) {
        return s.getX2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      width = rightMostShapeX - leftMostShapeX;
      size = this.textSize(title, attrs);
      x = size.width > width ? PaperMargin : leftMostShapeX + (width - size.width) / 2;
      point = {
        x: x,
        y: this.getNextShapeStartY()
      };
      return point;
    };

    Context.prototype.getResizedSize = function() {
      var bottomMostShapeY, rightMostShapeX, size;
      rightMostShapeX = _(this.shapes).chain().map(function(s) {
        return s.getX2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      bottomMostShapeY = _(this.shapes).chain().map(function(s) {
        return s.getY2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      size = {
        width: rightMostShapeX + PaperMargin,
        height: bottomMostShapeY + PaperMargin
      };
      return size;
    };

    Context.prototype.addShape = function(shape) {
      this.shapes.push(shape);
      return this;
    };

    Context.prototype.getLastDrawnShape = function() {
      var last;
      last = _(this.shapes).last();
      return last;
    };

    Context.prototype.getParticipantShape = function(name) {
      var shape;
      shape = _(this.shapes).chain().filter(function(s) {
        return s instanceof Participant;
      }).find(function(p) {
        return p.model.name === name;
      }).value();
      return shape;
    };

    Context.prototype.getParticipantShapeStartPoint = function(participant) {
      var lastParticipantShape, point, x;
      lastParticipantShape = this.getLastParticipantShape();
      if (lastParticipantShape) {
        x = lastParticipantShape.getX2() + this.getMessageWidth(participant, lastParticipantShape.model) + ShapeMargin;
      } else {
        x = this.getXMargin(this.totalNesting);
      }
      point = {
        x: x,
        y: PaperMargin
      };
      return point;
    };

    Context.prototype.getNextShapeStartY = function() {
      var y;
      y = this.getLastDrawnShape().getY2() + ShapeMargin;
      return y;
    };

    Context.prototype.getCompositeShapeWidth = function(x) {
      var diff, leftMostParticipantX, rightMostParticipantX, width;
      leftMostParticipantX = _(this.shapes).chain().filter(function(s) {
        return s instanceof Participant;
      }).map(function(p) {
        return p.getX1();
      }).sortBy(function(v) {
        return v;
      }).first().value();
      rightMostParticipantX = _(this.shapes).chain().filter(function(s) {
        return s instanceof Participant;
      }).map(function(p) {
        return p.getX2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      diff = Math.abs(x - leftMostParticipantX);
      width = rightMostParticipantX + diff - x;
      return width;
    };

    Context.prototype.getCompositeShapeHeight = function(y) {
      var height;
      height = this.getNextShapeStartY() - y;
      return height;
    };

    Context.prototype.getLifelinePosition = function(name) {
      var bottomMostOtherShapeY, height, participantShape, point, position;
      participantShape = this.getParticipantShape(name);
      point = participantShape.getLifelineStartPoint();
      bottomMostOtherShapeY = _(this.shapes).chain().filter(function(s) {
        return !(s instanceof Lifeline);
      }).map(function(l) {
        return l.getY2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      height = bottomMostOtherShapeY - point.y - Config.lineSize + ShapeMargin;
      position = {
        x: point.x,
        y: point.y + Config.lineSize,
        height: height
      };
      return position;
    };

    Context.prototype.getLastParticipantShape = function() {
      var last;
      last = _(this.shapes).chain().filter(function(s) {
        return s instanceof Participant;
      }).sortBy(function(p) {
        return p.getX2();
      }).last().value();
      return last;
    };

    Context.prototype.getMessageWidth = function(participant, previousParticipant) {
      var filteredMessages, width,
        _this = this;
      filteredMessages = _(this.streamlinedMessages).filter(function(m) {
        return (m.sender === previousParticipant && m.receiver === participant) || (m.sender === participant && m.receiver === previousParticipant) || (m.sender === participant && m.receiver === participant) || (m.sender === previousParticipant && m.receiver === previousParticipant);
      });
      if (!filteredMessages.length) {
        return 0;
      }
      width = _(filteredMessages).chain().map(function(m) {
        return _this.textSize(m.name).width;
      }).max().value();
      width += MessageMargin * 2;
      return width;
    };

    Context.prototype.textSize = function(value, attributes) {
      var size;
      size = this.shapeFactory.textSize(this.surface, value, attributes);
      return size;
    };

    return Context;

  })();
});
