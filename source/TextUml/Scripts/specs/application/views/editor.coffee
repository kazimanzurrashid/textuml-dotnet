define (require) ->
  $         = require 'jquery'
  Editor    = require '../../../application/views/editor'
  events    = require '../../../application/events'

  describe 'views/editor', ->
    originalCodeEditorViewType          = null
    originalOutputGeneratorViewType     = null
    originalParerType                   = null
    spiedListenTo                       = null
    view                                = null

    before ->
      originalCodeEditorViewType          = Editor::codeEditorViewType
      originalOutputGeneratorViewType     = Editor::outputGeneratorViewType
      originalParerType                   = Editor::parserType
      Editor::codeEditorViewType          = sinon.stub().returns {}
      Editor::outputGeneratorViewType     = sinon.stub().returns {}
      Editor::parserType                  = sinon.stub().returns parse: ->
      spiedListenTo                       = sinon.spy Editor.prototype, 'listenTo'

      fixtures.set '<div id="editor-container"></div>'

      view = new Editor
        el: $(fixtures.window().document.body).find '#editor-container'

    describe 'new', ->
      it 'creates code editor view', -> expect(view.code).to.exist

      it 'creates output generator view', -> expect(view.output).to.exist

      it 'creates parser', -> expect(view.parser).to.exist

      it 'subscribes to codeChanged application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'codeChanged', view.onCodeChanged

    describe '#onCodeChanged', ->
      code            = 'A -> B: Method'
      stubbedParse    = null

      before ->
        stubbedParse = sinon.stub view.parser, 'parse', ->
        view.onCodeChanged { code }

      it 'parses the code', ->
        expect(stubbedParse).to.have.been.calledWith code

      after -> stubbedParse.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      Editor::codeEditorViewType = originalCodeEditorViewType
      Editor::outputGeneratorViewType = originalOutputGeneratorViewType
      Editor::parserType = originalParerType
      fixtures.cleanUp()