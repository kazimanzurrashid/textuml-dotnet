var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, CompositeModel, Condition, ConditionModel, Config, Group, GroupHeader, GroupModel, LineStyle, Message, MessageModel, _;

  _ = require('underscore');
  Config = require('./config');
  Composite = require('./composite');
  Group = require('./group');
  GroupHeader = require('./groupheader');
  Message = require('./message');
  LineStyle = require('../linestyle');
  CompositeModel = require('../../models/sequence/composite');
  ConditionModel = require('../../models/sequence/condition');
  GroupModel = require('../../models/sequence/group');
  MessageModel = require('../../models/sequence/message');
  return Condition = (function(_super) {
    __extends(Condition, _super);

    function Condition(model, nestingLevel) {
      this.model = model;
      this.nestingLevel = nestingLevel;
      Condition.__super__.constructor.apply(this, arguments);
    }

    Condition.prototype.draw = function(context) {
      var box, elseGroups, height, ifGroup, ifHeader, nestingLevel, width, x, y,
        _this = this;

      ifGroup = this.model.getIfGroup();
      elseGroups = this.model.getElseGroups();
      nestingLevel = this.nestingLevel;
      x = context.getXMargin(nestingLevel);
      y = context.getNextShapeStartY();
      width = context.getCompositeShapeWidth(x);
      ifHeader = new GroupHeader(x, y, true, {
        type: 'alt',
        label: ifGroup.label
      }).draw(context);
      this.children.push(ifHeader);
      this.iterate(nestingLevel, ifGroup, context);
      _(elseGroups).each(function(group) {
        var divider, elseHeader;

        divider = context.shapeFactory.horizontalLine(x, context.getNextShapeStartY(), width, LineStyle.dash, {
          stroke: Config.borderColor
        }).draw(context.surface);
        _this.children.push(divider);
        elseHeader = new GroupHeader(x, context.getNextShapeStartY(), false, {
          type: 'alt',
          label: group.label
        }).draw(context);
        _this.children.push(elseHeader);
        return _this.iterate(nestingLevel, group, context);
      });
      height = context.getNextShapeStartY() - y;
      box = context.shapeFactory.rectangle(x, y, width, height, {
        stroke: Config.borderColor
      }).draw(context.surface);
      this.children.push(box);
      context.addShape(this);
      return this;
    };

    Condition.prototype.iterate = function(nestingLevel, group, context) {
      var _this = this;

      return _(group.children).each(function(c) {
        var shape;

        shape = null;
        if (c instanceof CompositeModel) {
          nestingLevel += 1;
          if (c instanceof ConditionModel) {
            shape = new Condition(c, nestingLevel);
          } else if (c instanceof GroupModel) {
            shape = new Group(c, nestingLevel);
          }
          nestingLevel -= 1;
        } else if (c instanceof MessageModel) {
          shape = new Message(c);
        }
        if (!shape) {
          return false;
        }
        return _this.children.push(shape.draw(context));
      });
    };

    return Condition;

  })(Composite);
});
