define (require) ->
  _           = require 'underscore'
  Kinetic     = require 'kinetic'
  Base        = require './base'
  LineStyle   = require '../linestyle'

  class Line extends Base
    constructor: (@x, @y, @style = LineStyle.line, attributes) ->
      super attributes

    draw: (surface) ->
      attributes = _(@attributes).defaults
        points: @getPoints()

      if @style is LineStyle.dash
        attributes = _(attributes).defaults dashArray: [8, 3]

      @element = new Kinetic.Line attributes
      @element.setListening false
      surface.add @element
      @

    getPoints: -> throw new Error 'Not implemented.'

    getX1: -> @x

    getY1: -> @y