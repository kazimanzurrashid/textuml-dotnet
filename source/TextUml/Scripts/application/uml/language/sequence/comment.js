define(function() {
  var Comment;

  return Comment = (function() {
    function Comment() {}

    Comment.prototype.handles = function(context) {
      return /^[\s\t]*'/i.test(context.line);
    };

    return Comment;

  })();
});
