define ->
  class Base
    constructor: (@attributes = {}) ->

    draw: (surface) -> throw new Error 'Not implemented.'

    remove: ->
      @element.destroy()
      @

    getX1: -> @element.getX()

    getY1: -> @element.getY()

    getX2: ->
      x2 = @getX1() + @getWidth()
      x2

    getY2: ->
      y2 = @getY1() + @getHeight()
      y2

    getWidth: -> @element.getWidth()

    getHeight: -> @element.getHeight()

    show: ->
      @element.show()
      @

    hide: ->
      @element.hide()
      @

    toBack: ->
      @element.moveToBottom()
      @

    toFront: ->
      @element.moveToTop()
      @