define ->
  class Base
    constructor: (parent) ->
      @setParent parent

    setParent: (parent) ->
      return @ if @parent is parent

      if @parent
        index = @parent.children.indexOf @
        @parent.children.splice index, 1 if index >= 0

      @parent = parent
      @parent.children.push @ if @parent
      @