define (require) ->
  $               = require 'jquery'
  _               = require 'underscore'
  Kinetic         = require 'kinetic'
  Context         = require './context'
  Participant     = require './participant'
  Condition       = require './condition'
  Group           = require './group'
  Message         = require './message'
  Lifeline        = require './lifeline'
  Title           = require './title'
  Factory         = require '../canvas/factory'
  CompositeModel  = require '../../models/sequence/composite'
  ConditionModel  = require '../../models/sequence/condition'
  GroupModel      = require '../../models/sequence/group'
  MessageModel    = require '../../models/sequence/message'

  class Renderer
    constructor: (@id = 'canvas') ->
      element = $ '#'+ @id
      @container = element.parent()
      @originalSize = @currentSize =
        width: element.width()
        height: element.height()
      @shapeFactory = new Factory

    clear: ->
      @currentSize =
        width: @originalSize.width
        height: @originalSize.height

      @surface.destroy() if @surface
      @surface = new Kinetic.Stage
        container: @id
        width: @currentSize.width
        height: @currentSize.height
      @resetSize()

    render: (diagram) ->
      @clear()
      return false if not diagram or not diagram.participants.length

      layer = new Kinetic.Layer
      context = new Context diagram, layer, @shapeFactory

      _(diagram.participants).each (model) ->
        new Participant(model).draw context

      currentNestingLevel = 0
      _(diagram.commands).each (model) ->
        shape = null
        if model instanceof CompositeModel
          currentNestingLevel += 1
          if model instanceof ConditionModel
            shape = new Condition model, currentNestingLevel
          else if model instanceof GroupModel
            shape = new Group model, currentNestingLevel
          currentNestingLevel -= 1
        else if model instanceof MessageModel
          shape = new Message model
        shape.draw context if shape

      _(diagram.participants).each (model) ->
        new Lifeline(model).draw(context).toBack()

      new Title(diagram.title).draw context if diagram.title

      @currentSize = context.getResizedSize()
      @surface.add layer

      @resetSize()
      @surface.draw()
      true

    resetSize: ->
      @surface.setWidth @currentSize.width
      @surface.setHeight @currentSize.height

      @container.width @currentSize.width
      @container.height @currentSize.height

    serialize: ->
      unless @surface?.getChildren().length
        throw new Error 'You cannot export a blank diagram, add some ' +
          'shapes prior exporting.'
      url = @surface.getChildren()[0].toDataURL()
      url