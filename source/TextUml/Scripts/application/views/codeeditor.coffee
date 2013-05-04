define (require) ->
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
      @editor.on 'change',  => @onCodeChanged()

      @listenTo events, 'exampleSelected', @onExampleSelected
      @listenTo events, 'documentChanged', @onDocumentChanged

    onExampleSelected: (e) ->
      code = @editor.getValue()
      code += '\n' if code
      code += e.example.get 'snippet'
      @editor.setValue code
      @editor.focus()

    onDocumentChanged: ->
      code = @context.getCurrentDocumentContent()
      @editor.setValue code
      @editor.focus()

    onCodeChanged: ->
      newCode = @editor.getValue()
      return false if newCode is @oldCode
      @context.setCurrentDocumentContent newCode
      events.trigger 'codeChanged', { code: newCode }
      @oldCode = newCode