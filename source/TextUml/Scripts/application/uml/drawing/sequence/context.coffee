define (require) ->
  _               = require 'underscore'
  Config          = require './config'
  Participant     = require './participant'
  Lifeline        = require './lifeline'
  CompositeModel  = require '../../models/sequence/composite'
  ConditionModel  = require '../../models/sequence/condition'
  GroupModel      = require '../../models/sequence/group'
  MessageModel    = require '../../models/sequence/message'

  PaperMargin       = 80
  ShapeMargin       = 40
  MessageMargin     = 10

  class Context
    constructor: (@diagram, @surface, @shapeFactory) ->
      @shapes = []
      @streamlinedMessages = @getStreamLinedMessages diagram.commands
      @totalNesting = @getNestingLevel()

    getStreamLinedMessages: (commands) ->
      messages = []
      _(commands).each (c) =>
        if c instanceof MessageModel
          messages.push c
        else if c instanceof CompositeModel
          _(@getStreamLinedMessages c.children).each (m) ->
            messages.push m
        else
          false
      messages

    getNestingLevel: (commands)->
      level = 0
      commands = @diagram.commands unless commands
      _(commands)
        .chain()
        .filter((c) -> c instanceof CompositeModel)
        .each (c) =>
          result = 1
          if c instanceof ConditionModel
            result += @getNestingLevel c.getIfGroup().children
            level = Math.max result, level
            _(c.getElseGroups()).each (g) =>
              result += @getNestingLevel g.children
              level = Math.max result, level
          else if c instanceof GroupModel
            result += @getNestingLevel c.children
            level = Math.max result, level
          else
            false
      level

    getXMargin: (nestingLevel) ->
      x = PaperMargin
      x += (ShapeMargin * nestingLevel) if nestingLevel
      x

    isLast: (participant) ->
      result = _(@diagram.participants).last() is participant
      result

    getTitleShapeStartPoint: (title, attrs)->
      leftMostShapeX = _(@shapes)
        .chain()
        .map((s) -> s.getX1())
        .sortBy((v) -> v)
        .first()
        .value()

      rightMostShapeX = _(@shapes)
        .chain()
        .map((s) -> s.getX2())
        .sortBy((v) -> v)
        .last()
        .value()

      width = rightMostShapeX - leftMostShapeX
      size = @textSize title, attrs
      x = if size.width > width
          PaperMargin
        else
          leftMostShapeX + (width - size.width) / 2

      point =
        x: x
        y: @getNextShapeStartY()
      point

    getResizedSize: ->
      rightMostShapeX = _(@shapes)
        .chain()
        .map((s) -> s.getX2())
        .sortBy((v) -> v)
        .last()
        .value()

      bottomMostShapeY = _(@shapes)
        .chain()
        .map((s) -> s.getY2())
        .sortBy((v) -> v)
        .last()
        .value()

      size =
        width: rightMostShapeX + PaperMargin
        height: bottomMostShapeY + PaperMargin
      size

    addShape: (shape) ->
      @shapes.push shape
      @

    getLastDrawnShape: ->
      last = _(@shapes).last()
      last

    getParticipantShape: (name) ->
      shape = _(@shapes)
        .chain()
        .filter((s) -> s instanceof Participant)
        .find((p) -> p.model.name is name)
        .value()
      shape

    getParticipantShapeStartPoint: (participant) ->
      lastParticipantShape = @getLastParticipantShape()
      if lastParticipantShape
        x = lastParticipantShape.getX2() +
            @getMessageWidth(participant, lastParticipantShape.model) +
            ShapeMargin
      else
        x = @getXMargin @totalNesting

      point =
        x: x
        y: PaperMargin
      point

    getNextShapeStartY: ->
      y = @getLastDrawnShape().getY2() + ShapeMargin
      y
   
    getCompositeShapeWidth: (x) ->
      leftMostParticipantX = _(@shapes)
        .chain()
        .filter((s) -> s instanceof Participant)
        .map((p) -> p.getX1())
        .sortBy((v) -> v)
        .first()
        .value()

      rightMostParticipantX = _(@shapes)
        .chain()
        .filter((s) -> s instanceof Participant)
        .map((p) -> p.getX2())
        .sortBy((v) -> v)
        .last()
        .value()

      diff = Math.abs x - leftMostParticipantX
      width = rightMostParticipantX + diff - x
      width

    getCompositeShapeHeight: (y) ->
      height = @getNextShapeStartY() - y
      height

    getLifelinePosition: (name) ->
      participantShape = @getParticipantShape name
      point = participantShape.getLifelineStartPoint()
      bottomMostOtherShapeY = _(@shapes)
        .chain()
        .filter((s) -> not (s instanceof Lifeline))
        .map((l) -> l.getY2())
        .sortBy((v) -> v)
        .last()
        .value()

      height = bottomMostOtherShapeY - point.y - Config.lineSize + ShapeMargin

      position =
        x: point.x
        y: point.y + Config.lineSize
        height: height
      position

    getLastParticipantShape: ->
      last = _(@shapes)
        .chain()
        .filter((s) -> s instanceof Participant)
        .sortBy((p) -> p.getX2())
        .last()
        .value()
      last

    getMessageWidth: (participant, previousParticipant) ->
      filteredMessages = _(@streamlinedMessages).filter (m) ->
        (m.sender is previousParticipant and m.receiver is participant) or
        (m.sender is participant and m.receiver is previousParticipant) or
        (m.sender is participant and m.receiver is participant) or
        (m.sender is previousParticipant and m.receiver is previousParticipant)

      return 0 unless filteredMessages.length

      width = _(filteredMessages)
        .chain()
        .map((m) => @textSize(m.name).width)
        .max()
        .value()
      width += (MessageMargin * 2)
      width

    textSize: (value, attributes) ->
      size = @shapeFactory.textSize @surface, value, attributes
      size