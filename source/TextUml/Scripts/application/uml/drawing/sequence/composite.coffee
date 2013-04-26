define (require) ->
  _ = require 'underscore'

  class Composite
    constructor: -> @children = []

    draw: (context) -> throw new Error 'Not implemented.'

    remove: ->
      _(@children).each (s) -> s.remove()
      @

    getX1: ->
      return 0 unless @children.length
      x1 = _(@children)
        .chain()
        .map((s) -> s.getX1())
        .sortBy((v) -> v)
        .first()
        .value()
      x1

    getY1: ->
      return 0 unless @children.length
      y1 = _(@children)
        .chain()
        .map((s) -> s.getY1())
        .sortBy((v) -> v)
        .first()
        .value()
      y1

    getX2: ->
      return 0 unless @children.length
      x2 = _(@children)
        .chain()
        .map((s) -> s.getX2())
        .sortBy((v) -> v)
        .last()
        .value()
      x2

    getY2: ->
      return 0 unless @children.length
      y2 = _(@children)
        .chain()
        .map((s) -> s.getY2())
        .sortBy((v) -> v)
        .last()
        .value()
      y2

    getWidth: ->
      width = @getX2() - @getX1()
      width

    getHeight: ->
      height = @getY2() - @getY1()
      height

    show: ->
      _(@children).each (s) -> s.show()
      @

    hide: ->
      _(@children).each (s) -> s.hide()
      @

    toBack: ->
      _(@children).each (s) -> s.toBack()
      @

    toFront: ->
      _(@children).each (s) -> s.toFront()
      @