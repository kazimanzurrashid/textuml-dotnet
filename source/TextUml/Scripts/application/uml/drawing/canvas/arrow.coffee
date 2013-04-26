define (require) ->
  Kinetic         = require 'kinetic'
  Base            = require './base'
  ArrowDirection  = require '../arrowdirection'
  ArrowStyle      = require '../arrowstyle'

  class Arrow extends Base
    constructor: (@x
      , @y
      , @direction = ArrowDirection.left
      , @style = ArrowStyle.open
      , @size
      , attributes) -> super attributes

    draw: (surface) ->
      data = @generatePath()
      @element = new Kinetic.Path { data }
      @element.setAttrs @attributes
      @element.setListening false
      surface.add @element
      @

    generatePath: ->
      path = null
      if @direction is ArrowDirection.right
        path = "M#{@x} #{@y} L#{@x - @size} #{@y - @size} "
        if @style is ArrowStyle.close
          path += "#{@x - @size} #{@y + @size} Z"
        else if @style is ArrowStyle.open
          path += "M#{@x} #{@y} L#{@x - @size} #{@y + @size}"
      else if @direction is ArrowDirection.left
        path = "M#{@x} #{@y} L#{@x + @size} #{@y - @size} "
        if @style is ArrowStyle.close
          path += "#{@x + @size} #{@y + @size} Z"
        else if @style is ArrowStyle.open
          path += "M#{@x} #{@y} L#{@x + @size} #{@y + @size}"
      path