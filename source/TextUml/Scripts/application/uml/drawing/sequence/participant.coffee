define (require) ->
  Config    = require './config'
  Composite = require './composite'

  Margin = 30

  textAttributes =
    fontFamily: Config.fontFamily
    fontSize: Config.fontSize
    fill: Config.foreColor

  class Participant extends Composite
    constructor: (@model) -> super

    draw: (context) ->
      point = context.getParticipantShapeStartPoint @model

      text = context.shapeFactory.text(point.x + Margin
        , point.y + Margin
        , @model.name
        , textAttributes)
        .draw context.surface

      width = (Margin * 2) + text.getWidth()
      height = (Margin * 2) + text.getHeight()
      box = context.shapeFactory.rectangle(point.x
        , point.y
        , width
        , height
        , stroke: Config.borderColor
        , fill: Config.backColor)
        .draw context.surface

      box.toBack()
      text.toFront()

      @children.push text, box

      context.addShape @
      @

    getLifelineStartPoint: ->
      x = @getX1() + (@getWidth() / 2)
      y = @getY1() + @getHeight()
      { x, y }