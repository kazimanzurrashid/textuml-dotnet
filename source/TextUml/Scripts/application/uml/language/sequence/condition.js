
define(function(require) {
  var Condition, trim;
  trim = require('./helpers').trim;
  return Condition = (function() {

    function Condition() {}

    Condition.prototype.handles = function(context) {
      var match;
      if (match = context.line.match(/^[\s\t]*alt\s*(.*)/i)) {
        context.addIf(trim(match[1]));
        return true;
      } else if (match = context.line.match(/^[\s\t]*else\s*(.*)/i)) {
        context.addElse(trim(match[1]));
        return true;
      }
      return false;
    };

    return Condition;

  })();
});
