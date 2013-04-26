define (require) ->
  _             = require 'underscore'
  Title         = require '../../models/sequence/title'
  Participant   = require '../../models/sequence/participant'
  Message       = require '../../models/sequence/message'
  Group         = require '../../models/sequence/group'
  Condition     = require '../../models/sequence/condition'
  Diagram       = require '../../models/sequence/diagram'

  class Context
    constructor: (@payload) ->
      @participants = []
      @commands = []

    getLineNumber: -> (@index or 0) + 1

    updateLineInfo: (@line, @index) ->

    setTitle: (text) -> @title = new Title text

    addParticipant: (name, alias) ->
      participant = new Participant name, alias
      @participants.push participant
      participant

    findParticipant: (identifier) ->
      identifier and
      @participants.length and
      _(@participants).find (p) ->
        identifier is p.name or identifier is p.alias

    findOrCreateParticipant: (identifier) ->
      @findParticipant(identifier) or @addParticipant(identifier)

    addMessage: (sender
      , receiver
      , name
      , async
      , callReturn
    ) ->
       message = new Message sender
        , receiver
        , name
        , async
        , callReturn
        , @parentCommand
        @commands.push message unless @parentCommand
        message

    addGroup: (type, label) ->
      group = new Group @parentCommand, label, type
      @commands.push group unless @parentCommand
      @parentCommand = group
      group
        
    addIf: (label) ->
      condition = new Condition @parentCommand
      group = condition.createIfGroup label
      @commands.push condition unless @parentCommand
      @parentCommand = group
      group

    addElse: (label) ->
      unless @parentCommand?.parent?.getIfGroup()
        errorMessage = "Error on line #{@getLineNumber()}, cannot " +
          'use \"else\"" without an \"alt\".'
        throw new Error errorMessage

      group = @parentCommand.parent.addElseGroup label
      @parentCommand = group
      group

    closeParent: ->
      unless @parentCommand
        errorMessage = "Error on line #{@getLineNumber()}, cannot end " +
          'without a group start.'
        throw new Error errorMessage

      if @parentCommand.parent instanceof Condition
        @parentCommand = @parentCommand.parent
      @parentCommand = @parentCommand.parent

    done: ->
      return unless @parentCommand

      errorMessage = 'Error! One or more group(s) is not properly ' +
        'closed, please add the missing \"end\" for unclosed group(s).'
      throw new Error errorMessage

    getDiagram: -> new Diagram @title, @participants, @commands