define(function() {
  var End;

  return End = (function() {
    function End() {}

    End.prototype.handles = function(context) {
      if (/^[\s\t]*end/i.test(context.line)) {
        context.closeParent();
        return true;
      }
      return false;
    };

    return End;

  })();
});
