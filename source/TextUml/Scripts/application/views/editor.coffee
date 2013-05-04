define (require) ->
  Backbone              = require 'backbone'
  CodeEditorView        = require './codeeditor'
  OutputGeneratorView   = require './outputgenerator'
  Parser                = require '../uml/language/sequence/parser'
  events                = require '../events'

  class EditorView extends Backbone.View
    el                        : '#editor-container'
    codeEditorViewType        : CodeEditorView
    outputGeneratorViewType   : OutputGeneratorView
    parserType                : Parser

    initialize: (options) ->
      context = options.context
      @code   = new @codeEditorViewType { context }
      @output = new @outputGeneratorViewType

      callbacks =
        onStart: ->
          events.trigger 'parseStarted'
        onWarning: (message) ->
          events.trigger 'parseWarning', { message }
        onError: (exception) ->
          events.trigger 'parseError', message: exception.message
        onComplete: (diagram) ->
          events.trigger 'parseCompleted', { diagram }

      @parser = new @parserType { callbacks }

      @listenTo events, 'codeChanged', @onCodeChanged

    onCodeChanged: (e) -> @parser.parse e.code