define ->
  class Comment
    handles: (context) ->
      /^[\s\t]*'/i.test context.line