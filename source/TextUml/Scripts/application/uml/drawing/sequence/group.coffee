define (require) ->
  _               = require 'underscore'
  Config          = require './config'
  Composite       = require './composite'
  GroupHeader     = require './groupheader'
  Message         = require './message'
  CompositeModel  = require '../../models/sequence/composite'
  ConditionModel  = require '../../models/sequence/condition'
  GroupModel      = require '../../models/sequence/group'
  MessageModel    = require '../../models/sequence/message'

  Condition = null
  getCondition = ->
    Condition or= require './condition'

  class Group extends Composite
    constructor: (@model, @nestingLevel) -> super

    draw: (context) ->
      nestingLevel = @nestingLevel
      x = context.getXMargin nestingLevel
      y = context.getNextShapeStartY()

      header = new GroupHeader(x
        , y
        , true
        , type: @model.type, label: @model.label)
        .draw context
      @children.push header

      _(@model.children).each (c) =>
        shape = null
        if c instanceof CompositeModel
          nestingLevel += 1
          if c instanceof ConditionModel
            condition = getCondition()
            shape = new condition c, nestingLevel
          else if c instanceof GroupModel
            shape = new Group c, nestingLevel
          nestingLevel -= 1
        else if c instanceof MessageModel
          shape = new Message c
        return false unless shape
        @children.push shape.draw context

      width = context.getCompositeShapeWidth x
      height = context.getNextShapeStartY() - y

      box = context.shapeFactory.rectangle(x
        , y
        , width
        , height
        , stroke: Config.borderColor)
        .draw context.surface
      @children.push box

      context.addShape @
      @