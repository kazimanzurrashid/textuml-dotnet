define (require) ->
  Rectangle       = require './rectangle'
  Text            = require './text'
  VerticalLine    = require './verticalline'
  HorizontalLine  = require './horizontalline'
  Arrow           = require './arrow'

  class Factory
    rectangle: (x, y, width, height, attributes) ->
      new Rectangle x, y, width, height, attributes

    text: (x, y, value, attributes) ->
      new Text x, y, value, attributes

    verticalLine: (x, y, height, style, attributes) ->
      new VerticalLine x, y, height, style, attributes

    horizontalLine: (x, y, width, style, attributes) ->
      new HorizontalLine x, y, width, style, attributes

    arrow: (x, y, direction, style, size, attributes) ->
      new Arrow x, y, direction, style, size, attributes

    textSize: (surface, value, attributes) ->
      Text.size surface, value, attributes