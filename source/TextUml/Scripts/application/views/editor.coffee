define (require) ->
  Backbone            = require 'backbone'
  CodeEditorView      = require './codeeditor'
  OutputGeneratorView = require './outputgenerator'
  Parser              = require '../uml/language/sequence/parser'
  events              = require '../events'

  class EditorView extends Backbone.View
    el: '#editor-container'

    initialize: (options) ->
      context = options.context

      @code = new CodeEditorView { context }
      @output = new OutputGeneratorView

      callbacks =
        onStart: ->
          events.trigger 'parseStarted'
        onWarning: (message) ->
          events.trigger 'parseWarning', { message }
        onError: (exception) ->
          events.trigger 'parseError', message: exception.message
        onComplete: (diagram) ->
          events.trigger 'parseCompleted', { diagram }

      @parser = new Parser { callbacks }

      events.on 'codeChanged', (e) => @parser.parse e.code