define(function(require) {
  var Participant, trim;

  trim = require('./helpers').trim;
  return Participant = (function() {
    function Participant() {}

    Participant.prototype.handles = function(context) {
      var alias, errorMessage, match, name, text;

      match = context.line.match(/^participant\s+(.+)/i);
      if (!match) {
        return false;
      }
      text = match[1];
      match = text.match(/^"(\w.*)"\s+as\s+(\w.*)/i);
      if (match) {
        name = trim(match[1]);
        alias = trim(match[2]);
      } else {
        name = trim(text);
      }
      if (context.findParticipant(name)) {
        errorMessage = ("Error on line " + (context.getLineNumber()) + ", ") + ("participant with name \"" + name + "\" already exists.");
        throw new Error(errorMessage);
      }
      if ((alias != null) && context.findParticipant(alias)) {
        errorMessage = ("Error on line " + (context.getLineNumber()) + ", ") + ("participant with alias \"" + alias + "\" already exists.");
        throw new Error(errorMessage);
      }
      context.addParticipant(name, alias);
      return true;
    };

    return Participant;

  })();
});
