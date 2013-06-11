define (require) ->
  Config    = require './config'
  Composite = require './composite'
  LineStyle = require '../linestyle'

  LabelMargin = 8

  textAttributes =
    fontFamily: Config.fontFamily
    fontSize: Config.fontSize
    fill: Config.foreColor

  class GroupHeader extends Composite
    constructor: (@x, @y, @showType, @model) -> super

    draw: (context) ->
      x = @x
      y = @y

      type = @model.type
      label = @model.label

      typeText = context.shapeFactory.text(x + LabelMargin
        , y  + LabelMargin
        , type
        , textAttributes)
        .draw context.surface
      @children.push typeText

      line1 = context.shapeFactory.verticalLine(
        typeText.getX2() + LabelMargin
        , y
        , typeText.getY2() - y + LabelMargin
        , LineStyle.line
        , stroke: Config.borderColor)
        .draw context.surface
      @children.push line1

      line2 = context.shapeFactory.horizontalLine(x
        , typeText.getY2() + LabelMargin
        , typeText.getX2() - x + LabelMargin
        , LineStyle.line
        , stroke: Config.borderColor)
        .draw context.surface
      @children.push line2

      if label
        labelText = context.shapeFactory.text(line1.getX2() + LabelMargin
          , y + LabelMargin
          , "[#{label}]"
          , textAttributes)
          .draw context.surface
        @children.push labelText

      unless @showType
        typeText.hide()
        line1.hide()
        line2.hide()

      context.addShape @
      @