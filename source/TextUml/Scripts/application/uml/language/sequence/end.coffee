define ->
  class End
    handles: (context) ->
      if /^[\s\t]*end/i.test context.line
        context.closeParent()
        return true
      false