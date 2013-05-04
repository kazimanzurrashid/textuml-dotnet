define(function(require) {
  var Title, trim;

  trim = require('./helpers').trim;
  return Title = (function() {
    function Title() {}

    Title.prototype.handles = function(context) {
      var errorMessage, match;

      match = context.line.match(/^title\s+(\w.*)/i);
      if (!match) {
        return false;
      }
      if (context.title || context.participants.length || context.commands.length) {
        errorMessage = ("Error on line " + (context.getLineNumber()) + ", ") + 'title must be defined before any other instruction.';
        throw new Error(errorMessage);
      }
      context.setTitle(trim(match[1]));
      return true;
    };

    return Title;

  })();
});
