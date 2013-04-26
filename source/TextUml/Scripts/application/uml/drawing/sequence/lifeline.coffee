define (require) ->
  Config    = require './config'
  Composite = require './composite'
  LineStyle = require '../linestyle'

  class Lifeline extends Composite
    constructor: (@model) -> super

    draw: (context) ->
      position = context.getLifelinePosition @model.name

      line = context.shapeFactory.verticalLine(position.x
        , position.y
        , position.height
        , LineStyle.dash
        , stroke: Config.borderColor
        ).draw(context.surface)
        .toBack()

      @children.push line
      context.addShape @
      @