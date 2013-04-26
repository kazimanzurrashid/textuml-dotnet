define (require) ->
  Line = require './line'

  class VerticalLine extends Line
    constructor: (x, y, @height, style, attributes) ->
     super x, y, style, attributes

    getPoints: -> [@x, @y, @x, @y + @height]

    getHeight: -> @height