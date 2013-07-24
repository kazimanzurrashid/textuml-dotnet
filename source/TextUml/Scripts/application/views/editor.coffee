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
      @context = options.context
      @code   = new @codeEditorViewType context: @context
      @output = new @outputGeneratorViewType

      callbacks =
        onStart: ->
          events.trigger 'parseStarted'
        onWarning: (message) ->
          events.trigger 'parseWarning', { message }
        onError: (exception) ->
          events.trigger 'parseError', message: exception.message
        onComplete: (e) ->
          events.trigger 'parseCompleted', e

      @parser = new @parserType { callbacks }

      @listenTo events, 'codeChanged', @onCodeChanged
      @listenTo events, 'documentContentChanged', @onDocumentContentChanged

      @codeLabel = @$('#code-section')
        .find('.title-bar')
        .find('span')
        .first()

      @listenTo events, 'documentChanged', @onDocumentChanged

    onCodeChanged: (e) -> @parser.parse e.code

    onDocumentContentChanged: (e) -> @code.setContent e.code

    onDocumentChanged: ->
      title = 'Code'
      unless @context.isCurrentDocumentEditable()
        title += ' (readonly)'
      @codeLabel.text title