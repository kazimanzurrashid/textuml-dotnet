
define(function(require) {
  var $, CompositeModel, Condition, ConditionModel, Context, Factory, Group, GroupModel, Kinetic, Lifeline, Message, MessageModel, Participant, Renderer, Title, _;
  $ = require('jquery');
  _ = require('underscore');
  Kinetic = require('kinetic');
  Context = require('./context');
  Participant = require('./participant');
  Condition = require('./condition');
  Group = require('./group');
  Message = require('./message');
  Lifeline = require('./lifeline');
  Title = require('./title');
  Factory = require('../canvas/factory');
  CompositeModel = require('../../models/sequence/composite');
  ConditionModel = require('../../models/sequence/condition');
  GroupModel = require('../../models/sequence/group');
  MessageModel = require('../../models/sequence/message');
  return Renderer = (function() {

    function Renderer(id) {
      var element;
      this.id = id != null ? id : 'canvas';
      element = $('#' + this.id);
      this.container = element.parent();
      this.originalSize = this.currentSize = {
        width: element.width(),
        height: element.height()
      };
      this.shapeFactory = new Factory;
    }

    Renderer.prototype.reset = function() {
      this.currentSize = {
        width: this.originalSize.width,
        height: this.originalSize.height
      };
      if (this.surface) {
        this.surface.destroy();
      }
      this.surface = new Kinetic.Stage({
        container: this.id,
        width: this.currentSize.width,
        height: this.currentSize.height
      });
      return this.resetSize();
    };

    Renderer.prototype.render = function(diagram) {
      var context, currentNestingLevel, layer;
      this.reset();
      if (!diagram || !diagram.participants.length) {
        return false;
      }
      layer = new Kinetic.Layer;
      context = new Context(diagram, layer, this.shapeFactory);
      _(diagram.participants).each(function(model) {
        return new Participant(model).draw(context);
      });
      currentNestingLevel = 0;
      _(diagram.commands).each(function(model) {
        var shape;
        shape = null;
        if (model instanceof CompositeModel) {
          currentNestingLevel += 1;
          if (model instanceof ConditionModel) {
            shape = new Condition(model, currentNestingLevel);
          } else if (model instanceof GroupModel) {
            shape = new Group(model, currentNestingLevel);
          }
          currentNestingLevel -= 1;
        } else if (model instanceof MessageModel) {
          shape = new Message(model);
        }
        if (shape) {
          return shape.draw(context);
        }
      });
      _(diagram.participants).each(function(model) {
        return new Lifeline(model).draw(context).toBack();
      });
      if (diagram.title) {
        new Title(diagram.title).draw(context);
      }
      this.currentSize = context.getResizedSize();
      this.surface.add(layer);
      this.resetSize();
      this.surface.draw();
      return true;
    };

    Renderer.prototype.resetSize = function() {
      this.surface.setWidth(this.currentSize.width);
      this.surface.setHeight(this.currentSize.height);
      this.container.width(this.currentSize.width);
      return this.container.height(this.currentSize.height);
    };

    Renderer.prototype.serialize = function() {
      var url, _ref;
      if (!((_ref = this.surface) != null ? _ref.getChildren().length : void 0)) {
        throw new Error('You cannot export a blank diagram, add some ' + 'shapes prior exporting.');
      }
      url = this.surface.getChildren()[0].toDataURL();
      return url;
    };

    return Renderer;

  })();
});
