define (require) ->
  $                = require 'jquery'
  DocumentTitle    = require '../../../application/views/documenttitle'
  events           = require '../../../application/events'

  describe 'views/documenttitle', ->
    context           = null
    spiedListenTo     = null
    view              = null

    before ->
      context =
        getNewDocumentTitle: ->
        setCurrentDocumentTitle: ->

      spiedListenTo = sinon.spy DocumentTitle.prototype, 'listenTo'

      fixtures.set """
        <div id="document-title-dialog">
          <input type="text" />
          <button>save</button>
        </div>"""

      view = new DocumentTitle
        el        : $(fixtures.window().document.body).find '#document-title-dialog'
        context   : context

    describe 'new', ->
      it 'is a modal dialog', -> expect(view.$el.data 'modal').to.be.ok

      it 'subscribes to showNewDocumentTitle application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events,
            'showNewDocumentTitle',
            view.onShowNewDocumentTitle

    describe '#onShowNewDocumentTitle', ->
      title             = 'test diagram'
      stubbedGetTitle   = null
      stubbedVal        = null
      stubbedModal      = null

      before ->
        stubbedGetTitle   = sinon.stub context, 'getNewDocumentTitle', -> title
        stubbedVal        = sinon.stub view.input, 'val', ->
        stubbedModal      = sinon.stub view.$el, 'modal', ->

        view.onShowNewDocumentTitle()

      it 'sets new document title', ->
        expect(stubbedVal).to.have.calledWith title

      it 'shows modal dialog', ->
        expect(stubbedModal).to.have.calledWith 'show'

      after ->
        stubbedGetTitle.restore()
        stubbedVal.restore()
        stubbedModal.restore()

    describe '#onDialogShow', ->
      stubbedHideFieldErrors = null

      before ->
        stubbedHideFieldErrors = sinon.stub view.$el, 'hideFieldErrors', ->
        view.onDialogShow()

      it 'hides field errors', ->
        expect(stubbedHideFieldErrors).to.have.been.calledOnce

      after -> stubbedHideFieldErrors.restore()

    describe '#onDiaglogShown', ->
      stubbedPutFocus = null

      before ->
        stubbedPutFocus = sinon.stub view.$el, 'putFocus', ->
        view.onDiaglogShown()

      it 'puts focus to input', ->
        expect(stubbedPutFocus).to.have.been.calledOnce

      after -> stubbedPutFocus.restore()

    describe '#onSubmit', ->

      describe 'success', ->
        title                     = 'test diagram'
        stubbedVal                = null
        stubbedSetTitle           = null
        stubbedModal              = null
        stubbedEventsTrigger      = null

        before ->
          stubbedVal              = sinon.stub view.input, 'val', -> title
          stubbedSetTitle         = sinon.stub context, 'setCurrentDocumentTitle', ->
          stubbedModal            = sinon.stub view.$el, 'modal', ->
          stubbedEventsTrigger    = sinon.stub events, 'trigger', ->

          view.onSubmit preventDefault: ->

        it 'sets current document title', ->
          expect(stubbedSetTitle).to.have.been.calledWith title

        it 'hides modal dialog', ->
          expect(stubbedModal).to.have.been.calledWith 'hide'

        it 'triggers newDocumentTitleAssigned application event', ->
          expect(stubbedEventsTrigger)
            .to.have.been.calledWith 'newDocumentTitleAssigned'

        after ->
          stubbedVal.restore()
          stubbedSetTitle.restore()
          stubbedModal.restore()
          stubbedEventsTrigger.restore()

      describe 'error', ->
        stubbedVal                = null
        stubbedShowFieldErrors    = null

        before ->
          stubbedVal                = sinon.stub view.input, 'val', -> ''
          stubbedShowFieldErrors    = sinon.stub view.$el, 'showFieldErrors', ->

          view.onSubmit preventDefault: ->

        it 'shows field errors', ->
          expect(stubbedShowFieldErrors).to.have.been.calledOnce

        after ->
          stubbedVal.restore()
          stubbedShowFieldErrors.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      fixtures.cleanUp()