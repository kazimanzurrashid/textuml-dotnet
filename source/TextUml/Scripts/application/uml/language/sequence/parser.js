
define(function(require) {
  var Comment, Condition, Context, End, Group, Message, NewLine, Parser, Participant, Title, createHandlers, trim, _;
  _ = require('underscore');
  Comment = require('./comment');
  Title = require('./title');
  Participant = require('./participant');
  Message = require('./message');
  Group = require('./group');
  Condition = require('./condition');
  End = require('./end');
  Context = require('./context');
  trim = require('./helpers').trim;
  NewLine = /(\r\n|\n|\r)/g;
  createHandlers = function() {
    return [new Comment, new Title, new Participant, new Message, new Group, new Condition, new End];
  };
  return Parser = (function() {

    function Parser(options) {
      if (options == null) {
        options = {};
      }
      this.callbacks = _(options.callbacks || {}).defaults({
        onStart: function() {},
        onWarning: function() {},
        onError: function() {},
        onComplete: function() {}
      });
      this.handlers = options.handlers || createHandlers();
    }

    Parser.prototype.parse = function(input) {
      var context, diagram, lines,
        _this = this;
      this.callbacks.onStart();
      if (!input) {
        this.callbacks.onComplete();
        return false;
      }
      lines = _(input.split(NewLine)).reject(function(x) {
        return NewLine.test(x) || !(trim(x) || '').length;
      });
      context = new Context(lines.join('\n'));
      try {
        _(lines).each(function(line, index) {
          var handled, message;
          context.updateLineInfo(line, index);
          handled = _(_this.handlers).some(function(handler) {
            return handler.handles(context);
          });
          if (!handled) {
            message = ("Warning on line " + (context.getLineNumber()) + ", ") + ("unrecognized command \"" + line + "\".");
            return _this.callbacks.onWarning(message);
          }
        });
        context.done();
        diagram = context.getDiagram();
        this.callbacks.onComplete(diagram.participants.length ? diagram : void 0);
        return true;
      } catch (exception) {
        this.callbacks.onError(exception);
        return false;
      }
    };

    return Parser;

  })();
});
