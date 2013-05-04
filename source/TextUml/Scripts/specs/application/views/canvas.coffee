define (require) ->
  $           = require 'jquery'
  Canvas      = require '../../../application/views/canvas'
  events      = require '../../../application/events'

  describe 'views/canvas', ->
    context         = null
    spiedListenTo   = null
    view            = null

    before ->
      fixtures.set '<div id="canvas-container"></div>'
      context = setCurrentDocumentTitle: (title) ->
      spiedListenTo = sinon.spy Canvas.prototype, 'listenTo'
      view = new Canvas
        el        : $(fixtures.window().document.body).find '#canvas-container'
        context   : context

    describe 'new', ->
      it 'creates renderer', -> expect(view.renderer).to.exist

      it 'subscribes to parseStarted application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'parseStarted', view.onParseStarted

      it 'subscribes to parseCompleted application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events,
            'parseCompleted', view.onParseCompleted

      it 'subscribes to exportDocument application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events,
            'exportDocument', view.onExportDocument

    describe '#onParseStarted', ->
      stubbedReset = null

      before ->
        stubbedReset = sinon.stub view.renderer, 'reset', ->
        view.onParseStarted()

      it 'resets the renderer', ->
        expect(stubbedReset).to.have.been.calledOnce

      after -> stubbedReset.reset()

    describe '#onParseCompleted', ->
      stubbedRender   = null
      spiedSetTitle   = null

      before ->
        stubbedRender     = sinon.stub view.renderer, 'render', ->
        spiedSetTitle     = sinon.spy context, 'setCurrentDocumentTitle'

      describe 'with diagram', ->
        diagram = null

        before ->
          diagram = title: { text: 'dummy' }
          view.onParseCompleted { diagram }

        it 'renders diagram', ->
          expect(stubbedRender).to.have.been.calledWith diagram

        it 'sets current document title', ->
          expect(spiedSetTitle).to.have.been.calledWith diagram.title.text

        after ->
          stubbedRender.reset()
          spiedSetTitle.reset()

      describe 'without diagram', ->
        before -> view.onParseCompleted()

        it 'does not render diagram', ->
          expect(stubbedRender).to.not.have.been.called

        it 'sets current document title to null', ->
          expect(spiedSetTitle).to.have.been.calledWith null

        after ->
          stubbedRender.reset()
          spiedSetTitle.reset()

      after ->
        stubbedRender.restore()
        spiedSetTitle.restore()

    describe '#onExportDocument', ->
      stubbedSerialize = null

      before -> stubbedSerialize = sinon.stub view.renderer, 'serialize'

      describe 'success', ->
        data                    = 'base64 encoded string'
        stubbedEventTrigger     = null

        before ->
          stubbedEventTrigger = sinon.stub events, 'trigger', ->
          stubbedSerialize.returns data
          
          view.onExportDocument()

        it 'triggers documentExported application event', ->
          expect(stubbedEventTrigger)
            .to.have.been.calledWith 'documentExported', { data }

        after ->
          stubbedSerialize.reset()
          stubbedEventTrigger.restore()

      describe 'error', ->
        errorMessage            = 'An user defined error'
        stubbedShowErrorbar     = null

        before ->
          stubbedSerialize.throws new Error(errorMessage)
          stubbedShowErrorbar = sinon.stub $, 'showErrorbar', ->

          view.onExportDocument()

        it 'shows error bar', ->
          expect(stubbedShowErrorbar).to.have.been.calledWith errorMessage

        after ->
          stubbedSerialize.reset()
          stubbedShowErrorbar.restore()

      after -> stubbedSerialize.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      fixtures.cleanUp()