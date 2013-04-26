define (require) ->
  Config    = require './config'
  Composite = require './composite'

  attrs =
    fontFamily: Config.fontFamily
    fontSize: Config.fontSize * 1.5
    fill: Config.foreColor

  class Title extends Composite
    constructor: (@model) -> super

    draw: (context) ->
      point = context.getTitleShapeStartPoint @model.text, attrs
      text = context.shapeFactory.text(point.x
        , point.y
        , @model.text
        , attrs).draw context.surface
      @children.push text

      context.addShape @
      @