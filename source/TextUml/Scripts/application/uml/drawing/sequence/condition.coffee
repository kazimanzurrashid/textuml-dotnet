define (require) ->
  _               = require 'underscore'
  Config          = require './config'
  Composite       = require './composite'
  Group           = require './group'
  GroupHeader     = require './groupheader'
  Message         = require './message'
  LineStyle       = require '../linestyle'
  CompositeModel  = require '../../models/sequence/composite'
  ConditionModel  = require '../../models/sequence/condition'
  GroupModel      = require '../../models/sequence/group'
  MessageModel    = require '../../models/sequence/message'

  class Condition extends Composite
    constructor: (@model, @nestingLevel) -> super

    draw: (context) ->
      ifGroup = @model.getIfGroup()
      elseGroups = @model.getElseGroups()

      nestingLevel = @nestingLevel
      x = context.getXMargin nestingLevel
      y = context.getNextShapeStartY()
      width = context.getCompositeShapeWidth x

      ifHeader = new GroupHeader(x
        , y
        , true
        , type: 'alt', label: ifGroup.label)
        .draw context
      @children.push ifHeader
      @iterate nestingLevel, ifGroup, context

      _(elseGroups).each (group) =>
        divider = context.shapeFactory.horizontalLine(x
          , context.getNextShapeStartY()
          , width
          , LineStyle.dash
          , stroke: Config.borderColor)
          .draw context.surface
        @children.push divider

        elseHeader = new GroupHeader(x
        , context.getNextShapeStartY()
        , false
        , type: 'alt', label: group.label)
        .draw context
        @children.push elseHeader
        @iterate nestingLevel, group, context

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

    iterate: (nestingLevel, group, context) ->
      _(group.children).each (c) =>
        shape = null
        if c instanceof CompositeModel
          nestingLevel += 1
          if c instanceof ConditionModel
            shape = new Condition c, nestingLevel
          else if c instanceof GroupModel
            shape = new Group c, nestingLevel
          nestingLevel -= 1
        else if c instanceof MessageModel
          shape = new Message c
        return false unless shape
        @children.push shape.draw context