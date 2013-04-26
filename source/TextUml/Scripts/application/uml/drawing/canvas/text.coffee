define (require) ->
  _       = require 'underscore'
  Kinetic = require 'kinetic'
  Base    = require './base'

  class Text extends Base
    constructor: (@x, @y, @value, attributes) -> super attributes

    @size: (surface, value, attributes) ->
      text = new Text(0, 0, value, attributes).draw surface
      result =
        width: text.getWidth()
        height: text.getHeight()
      text.remove()
      result

    draw: (surface) ->
      @element = new Kinetic.Text
        x: @x
        y: @y
        text: @value

      @element.setAttrs @attributes
      @element.setListening false
      surface.add @element
      @