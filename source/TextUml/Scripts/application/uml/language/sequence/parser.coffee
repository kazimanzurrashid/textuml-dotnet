define (require) ->
  _             = require 'underscore'
  Comment       = require './comment'
  Title         = require './title'
  Participant   = require './participant'
  Message       = require './message'
  Group         = require './group'
  Condition     = require './condition'
  End           = require './end'
  Context       = require './context'
  trim          = require('./helpers').trim
  
  NewLine = /(\r\n|\n|\r)/g

  createHandlers = ->
    [
      new Comment
      new Title
      new Participant
      new Message
      new Group
      new Condition
      new End
    ]

  class Parser
    contextType: Context

    constructor: (options = {}) ->
      @callbacks = _(options.callbacks or {}).defaults
        onStart       : ->
        onWarning     : ->
        onError       : ->
        onComplete    : ->

      @handlers = options.handlers or createHandlers()

    parse: (input) ->
      @callbacks.onStart()
      unless input
        @callbacks.onComplete()
        return false

      lines = _(input.split NewLine).reject (x) ->
        NewLine.test(x) or not (trim(x) or '').length

      context = new @contextType lines.join '\n'

      try
        _(lines).each (line, index) =>
          context.updateLineInfo line, index
          handled = _(@handlers).some (handler) -> handler.handles context
          unless handled
            message = "Warning on line #{context.getLineNumber()}, " +
              "unrecognized command \"#{line}\"."
            @callbacks.onWarning message
        context.done()
        diagram = context.getDiagram()
        @callbacks.onComplete if diagram.participants.length then diagram
        return true
      catch exception
        @callbacks.onError exception
        return false