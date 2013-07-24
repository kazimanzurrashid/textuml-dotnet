define (require) ->
  _                 = require 'underscore'
  Backbone          = require 'backbone'
  CodeMirror        = require 'codemirror'
  events            = require '../events'
  require 'codemirrormarkselection'
  require 'codemirroractiveline'

  CodeMirror.defineMode 'uml', ->
    Keywords = /^(?:title|participant|as|alt|opt|loop|else|end)$/im

    token: (stream) ->
      return null if stream.eatSpace()

      chr = stream.next()

      if chr is '\''
        stream.skipToEnd()
        return 'comment'

      if chr is '"'
        stream.skipTo '"'
        return 'string'

      if /\w/.test chr
        stream.eatWhile /\w/
        value = stream.current()
        return 'keyword' if Keywords.test value

  class CodeEditorView extends Backbone.View
    el: '#code-text-area'

    initialize: (options) ->
      @context = options.context

      @editor = CodeMirror.fromTextArea @$el.get(0),
        mode              : 'uml'
        tabSize           : 2
        indentWithTabs    : true
        lineNumbers       : true
        dragDrop          : false
        styleActiveLine   : true

      @oldCode = @editor.getValue()
      @editor.on 'change', _(=> @onCodeChanged()).debounce 1000 * 0.8

      @listenTo events, 'exampleSelected', @onExampleSelected
      @listenTo events, 'documentChanged', @onDocumentChanged

    setContent: (value) ->
      @changing = true
      @context.setCurrentDocumentContent value
      @editor.setValue value
      events.trigger 'codeChanged', code: value
      @changing = false

    onExampleSelected: (e) ->
      return false unless @context.isCurrentDocumentEditable()
      code = @editor.getValue()
      code += '\n' if code
      code += e.example.get 'snippet'
      @editor.setValue code
      @editor.focus()

    onDocumentChanged: ->
      @changing = true
      code = @context.getCurrentDocumentContent()
      @editor.setOption 'readOnly', not @context.isCurrentDocumentEditable()
      @editor.setValue code
      @editor.focus()
      @changing = false

    onCodeChanged: (change) ->
      newCode = @editor.getValue()
      return false if newCode is @oldCode
      @context.setCurrentDocumentContent newCode
      events.trigger 'codeChanged', code: newCode
      unless @changing
        events.trigger 'broadcastDocumentContentChange', content: newCode
      @oldCode = newCode