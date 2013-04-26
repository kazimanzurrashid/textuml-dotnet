define (require) ->
  Line = require './line'

  class HorizontalLine extends Line
    constructor: (x, y, @width, style, attributes) ->
      super x, y, style, attributes

    getPoints: -> [@x, @y, @x + @width, @y]

    getWidth: -> @width