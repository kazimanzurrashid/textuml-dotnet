define(function(require) {
  var Condition, Context, Diagram, Group, Message, Participant, Title, _;

  _ = require('underscore');
  Title = require('../../models/sequence/title');
  Participant = require('../../models/sequence/participant');
  Message = require('../../models/sequence/message');
  Group = require('../../models/sequence/group');
  Condition = require('../../models/sequence/condition');
  Diagram = require('../../models/sequence/diagram');
  return Context = (function() {
    function Context(payload) {
      this.payload = payload;
      this.participants = [];
      this.commands = [];
    }

    Context.prototype.getLineNumber = function() {
      return (this.index || 0) + 1;
    };

    Context.prototype.updateLineInfo = function(line, index) {
      this.line = line;
      this.index = index;
    };

    Context.prototype.setTitle = function(text) {
      return this.title = new Title(text);
    };

    Context.prototype.addParticipant = function(name, alias) {
      var participant;

      participant = new Participant(name, alias);
      this.participants.push(participant);
      return participant;
    };

    Context.prototype.findParticipant = function(identifier) {
      return identifier && this.participants.length && _(this.participants).find(function(p) {
        return identifier === p.name || identifier === p.alias;
      });
    };

    Context.prototype.findOrCreateParticipant = function(identifier) {
      return this.findParticipant(identifier) || this.addParticipant(identifier);
    };

    Context.prototype.addMessage = function(sender, receiver, name, async, callReturn) {
      var message;

      message = new Message(sender, receiver, name, async, callReturn, this.parentCommand);
      if (!this.parentCommand) {
        this.commands.push(message);
      }
      return message;
    };

    Context.prototype.addGroup = function(type, label) {
      var group;

      group = new Group(this.parentCommand, label, type);
      if (!this.parentCommand) {
        this.commands.push(group);
      }
      this.parentCommand = group;
      return group;
    };

    Context.prototype.addIf = function(label) {
      var condition, group;

      condition = new Condition(this.parentCommand);
      group = condition.createIfGroup(label);
      if (!this.parentCommand) {
        this.commands.push(condition);
      }
      this.parentCommand = group;
      return group;
    };

    Context.prototype.addElse = function(label) {
      var errorMessage, group, _ref, _ref1;

      if (!((_ref = this.parentCommand) != null ? (_ref1 = _ref.parent) != null ? _ref1.getIfGroup() : void 0 : void 0)) {
        errorMessage = ("Error on line " + (this.getLineNumber()) + ", cannot ") + 'use \"else\" without an \"alt\".';
        throw new Error(errorMessage);
      }
      group = this.parentCommand.parent.addElseGroup(label);
      this.parentCommand = group;
      return group;
    };

    Context.prototype.closeParent = function() {
      var errorMessage;

      if (!this.parentCommand) {
        errorMessage = ("Error on line " + (this.getLineNumber()) + ", cannot end ") + 'without a group start.';
        throw new Error(errorMessage);
      }
      if (this.parentCommand.parent instanceof Condition) {
        this.parentCommand = this.parentCommand.parent;
      }
      return this.parentCommand = this.parentCommand.parent;
    };

    Context.prototype.done = function() {
      var errorMessage;

      if (!this.parentCommand) {
        return;
      }
      errorMessage = 'Error! One or more group(s) is not properly ' + 'closed, please add the missing \"end\" for unclosed group(s).';
      throw new Error(errorMessage);
    };

    Context.prototype.getDiagram = function() {
      return new Diagram(this.title, this.participants, this.commands);
    };

    return Context;

  })();
});
