define (require) ->
  _       = require 'underscore'
  Kinetic = require 'kinetic'
  Base    = require './base'

  class Rectangle extends Base
    constructor: (@x, @y, @width, @height, attributes) -> super attributes

    draw: (surface) ->
      @element = new Kinetic.Rect
        x: @x
        y: @y
        width: @width
        height: @height

      @element.setAttrs @attributes unless _(@attributes).isEmpty()
      @element.setListening false
      surface.add @element
      @