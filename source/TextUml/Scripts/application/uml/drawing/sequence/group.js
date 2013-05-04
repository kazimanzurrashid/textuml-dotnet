var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, CompositeModel, Condition, ConditionModel, Config, Group, GroupHeader, GroupModel, Message, MessageModel, getCondition, _;

  _ = require('underscore');
  Config = require('./config');
  Composite = require('./composite');
  GroupHeader = require('./groupheader');
  Message = require('./message');
  CompositeModel = require('../../models/sequence/composite');
  ConditionModel = require('../../models/sequence/condition');
  GroupModel = require('../../models/sequence/group');
  MessageModel = require('../../models/sequence/message');
  Condition = null;
  getCondition = function() {
    return Condition || (Condition = require('./condition'));
  };
  return Group = (function(_super) {
    __extends(Group, _super);

    function Group(model, nestingLevel) {
      this.model = model;
      this.nestingLevel = nestingLevel;
      Group.__super__.constructor.apply(this, arguments);
    }

    Group.prototype.draw = function(context) {
      var box, header, height, nestingLevel, width, x, y,
        _this = this;

      nestingLevel = this.nestingLevel;
      x = context.getXMargin(nestingLevel);
      y = context.getNextShapeStartY();
      header = new GroupHeader(x, y, true, {
        type: this.model.type,
        label: this.model.label
      }).draw(context);
      this.children.push(header);
      _(this.model.children).each(function(c) {
        var condition, shape;

        shape = null;
        if (c instanceof CompositeModel) {
          nestingLevel += 1;
          if (c instanceof ConditionModel) {
            condition = getCondition();
            shape = new condition(c, nestingLevel);
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
      width = context.getCompositeShapeWidth(x);
      height = context.getNextShapeStartY() - y;
      box = context.shapeFactory.rectangle(x, y, width, height, {
        stroke: Config.borderColor
      }).draw(context.surface);
      this.children.push(box);
      context.addShape(this);
      return this;
    };

    return Group;

  })(Composite);
});
