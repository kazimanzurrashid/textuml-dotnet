define (require) ->
  $                   = require 'jquery'
  DocumentBrowser     = require '../../../application/views/documentbrowser'
  events              = require '../../../application/events'

  describe 'views/documentbrowser', ->
    originalListViewType    = null
    context                 = null
    spiedListenTo           = null
    view                    = null
    
    before ->
      fixtures.set """
        <div id="document-browser-dialog">
          <button type="button" class="btn btn-primary">Open</button>
        </div>"""
      stubbedListViewType = sinon.stub().returns
        on              : ->
        off             : ->
        scrollToTop     : ->
        resetSelection  : ->
        getSelectedId   : ->

      originalListViewType              = DocumentBrowser::listViewType
      DocumentBrowser::listViewType     = stubbedListViewType
      context                           = sinon.stub documents: []
      spiedListenTo                     = sinon.spy DocumentBrowser.prototype, 'listenTo'

      view = new DocumentBrowser
        el        : $(fixtures.window().document.body).find '#document-browser-dialog'
        context   : context

    describe 'new', ->
      it 'creates document list', -> expect(view.list).to.exist

      it 'subscribes to document list selected event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith view.list, 'selected'

      it 'subscribes to document list opened event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith view.list, 'opened'

      it 'subscribes to showDocuments application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'showDocuments'

      it 'is a modal dialog', -> expect(view.$el.data 'modal').to.be.ok

    describe '#onShowDocuments', ->
      originalCancelCallback    = null
      stubbedModal              = null
      cancelCallback            = null

      before ->
        originalCancelCallback    = view.cancel
        cancelCallback            = ->
        stubbedModal              = sinon.stub view.$el, 'modal', ->

        view.onShowDocuments { cancel: cancelCallback }

      it 'sets cancel callback', ->
        expect(view.cancel).to.deep.equal cancelCallback

      it 'shows modal dialog', ->
        expect(stubbedModal).to.have.been.calledWith 'show'

      after ->
        view.cancel = originalCancelCallback
        stubbedModal.restore()

    describe '#onDiaglogShow', ->
      originalCanceled          = null
      stubbedScrollToTop        = null
      stubbedResetSelection     = null
      stubbedSetProperty        = null

      before ->
        originalCanceled          = view.canceled
        stubbedScrollToTop        = sinon.stub view.list, 'scrollToTop', ->
        stubbedResetSelection     = sinon.stub view.list, 'resetSelection', ->
        stubbedSetProperty        = sinon.stub view.submitButton, 'prop', ->

        view.onDiaglogShow()

      it 'sets #canceled to true', -> expect(view.canceled).to.true

      it 'scrolls list to top', ->
        expect(stubbedScrollToTop).to.have.been.calledOnce

      it 'resets current selection', ->
        expect(stubbedResetSelection).to.have.been.calledOnce

      it 'disables submit button', ->
        expect(stubbedSetProperty).to.have.been.calledWith 'disabled', true

      after ->
        view.canceled = originalCanceled
        stubbedScrollToTop.restore()
        stubbedResetSelection.restore()
        stubbedSetProperty.restore()
        
    describe '#onDialogHidden', ->
      originalCanceled          = null
      originalCancelCallback    = null
      cancelCalled              = null

      before ->
        originalCanceled            = view.canceled
        originalcancelCallback      = view.cancel
        view.cancel                 = -> cancelCalled = true

      describe '#canceled is true', ->
        before ->
          cancelCalled      = false
          view.canceled     = true
          view.onDialogHidden()

        it 'executes cancel callback', -> expect(cancelCalled).to.be.true

      describe '#canceled is false', ->
        before ->
          cancelCalled      = false
          view.canceled     = false
          view.onDialogHidden()

        it 'does not execute cancel callback', ->
          expect(cancelCalled).to.be.false

      after ->
        view.canceled     = originalCanceled
        view.cancel       = originalCancelCallback

    describe '#onDocumentSelected', ->
      stubbedSetProperty = null

      before ->
        stubbedSetProperty = sinon.stub view.submitButton, 'prop', ->
        view.onDocumentSelected()

      it 'enables submit button', ->
        expect(stubbedSetProperty).to.have.been.calledWith 'disabled', false

      after -> stubbedSetProperty.restore()

    describe '#onDocumentOpened', ->
      stubbedTrigger = null

      before ->
        stubbedTrigger = sinon.stub view.submitButton, 'trigger', ->
        view.onDocumentOpened()

      it 'triggers submit button click', ->
        expect(stubbedTrigger).to.have.been.calledWith 'click'

      after -> stubbedTrigger.restore()

    describe '#onSubmit', ->
      originalCanceled        = null
      stubbedModal            = null
      stubbedGetId            = null
      stubbedEventsTrigger    = null

      before ->
        originalCanceled        = view.canceled
        stubbedModal            = sinon.stub view.$el, 'modal', ->
        stubbedGetId            = sinon.stub view.list, 'getSelectedId', -> 1
        stubbedEventsTrigger    = sinon.stub events, 'trigger', ->

        view.onSubmit preventDefault: ->

      it 'sets #canceled to false', -> expect(view.canceled).to.be.false

      it 'sets hides modal dialog', ->
        expect(stubbedModal).to.have.been.calledWith 'hide'

      it 'triggers documentSelected application event', ->
        expect(stubbedEventsTrigger)
          .to.have.been.calledWith 'documentSelected', { id: 1 }

      after ->
        view.canceled = originalCanceled
        stubbedModal.restore()
        stubbedGetId.restore()
        stubbedEventsTrigger.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      DocumentBrowser::listViewType = originalListViewType
      fixtures.cleanUp()