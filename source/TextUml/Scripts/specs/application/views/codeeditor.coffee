define (require) ->
  $               = require 'jquery'
  CodeMirror      = require 'codemirror'
  CodeEditor      = require '../../../application/views/codeeditor'
  events          = require '../../../application/events'

  describe 'views/codeeditor', ->
    context         = null
    spiedListenTo   = null
    view            = null

    before ->
      fixtures.set '<textarea id="code-text-area"></textarea>'
      context =
        getCurrentDocumentContent: ->
        setCurrentDocumentContent: (code) ->
        isCurrentDocumentEditable: ->

      spiedListenTo = sinon.spy CodeEditor.prototype, 'listenTo'
      view = new CodeEditor
        el        : $(fixtures.window().document.body).find '#code-text-area'
        context   : context

    describe 'new', ->
      it 'creates code mirror editor', -> expect(view.editor).to.exist

      it 'subscribes to exampleSelected application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'exampleSelected', view.onExampleSelected

      it 'subscribes to documentChanged application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'documentChanged', view.onDocumentChanged

    describe '#onExampleSelected', ->
      snippet               = 'A -> B: Method'

      before ->
        example     = get: (attr) ->
        stubbedGet  = sinon.stub example, 'get'
        stubbedGet.withArgs('snippet').returns snippet

        sinon.stub context, 'isCurrentDocumentEditable', -> true

        view.onExampleSelected { example}

      it 'appends example snippet', ->
        expect(view.editor.getValue()).to.contain snippet

    describe '#onDocumentChanged', ->
      content               = 'A -> B: Method\nA <- B: Method returns'

      before ->
        sinon.stub context, 'getCurrentDocumentContent', -> content

        view.onDocumentChanged()

      it 'replaces with current document content', ->
        expect(view.editor.getValue()).to.equal content

    describe '#onCodeChanged', ->
      content                 = 'A -> B: Method\nA <- B: Method returns'
      originalOldCode         = null
      stubbedSetContent       = null
      stubbedEventsTrigger    = null

      before ->
        view.oldCode            = view.oldCode
        stubbedSetContent       = sinon.stub context, 'setCurrentDocumentContent', ->
        stubbedEventsTrigger    = sinon.stub events, 'trigger', ->

        view.editor.setValue content
        view.oldCode = ''
        view.onCodeChanged()

      it 'sets current document content', ->
        expect(stubbedSetContent).to.have.been.calledWith content

      it 'triggers codeChanged application event', ->
        expect(stubbedEventsTrigger)
          .to.have.been.calledWith 'codeChanged', code: content

      after ->
        view.oldCode = originalOldCode
        stubbedSetContent.restore()
        stubbedEventsTrigger.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      fixtures.cleanUp()