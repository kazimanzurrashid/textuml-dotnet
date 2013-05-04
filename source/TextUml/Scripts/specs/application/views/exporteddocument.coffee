define (require) ->
  $                   = require 'jquery'
  ExportedDocument    = require '../../../application/views/exporteddocument'
  events              = require '../../../application/events'

  describe 'views/exporteddocument', ->
    view            = null
    spiedListenTo   = null

    before ->
      spiedListenTo = sinon.spy ExportedDocument.prototype, 'listenTo'
      fixtures.set """
        <div id="exported-document-dialog">
          <img style="display:none"/>
        </div>"""
      view = new ExportedDocument
        el: $(fixtures.window().document.body).find '#exported-document-dialog'

    describe 'new', ->
      it 'is a modal dialog', -> expect(view.$el.data 'modal').to.be.ok

      it 'subscribes to documentExported application event', ->
        expect(spiedListenTo)
          .to.have.been.calledWith events, 'documentExported', view.onDocumentExported

    describe '#onDocumentExported', ->
      stubbedModal      = null
      stubbedImageProp  = null

      before ->
        stubbedModal      = sinon.stub view.$el, 'modal', ->
        stubbedImageProp  = sinon.stub view.image, 'prop', ->

        view.onDocumentExported data: '/Content/images/spacer.gif'

      it 'shows modal dialog', ->
        expect(stubbedModal).to.have.calledWith 'show'

      it 'sets image src', ->
        expect(stubbedImageProp)
          .to.have.calledWith 'src', '/Content/images/spacer.gif'

      after ->
        stubbedImageProp.restore()
        stubbedImageProp.restore()

    describe '#onDialogShown', ->
      stubbedFadeIn = null

      before ->
        stubbedFadeIn = sinon.stub view.messageBox, 'fadeIn', ->
        view.onDialogShown()

      it 'fade ins the message box', ->
        expect(stubbedFadeIn).to.have.been.calledWith sinon.match.number

      after -> stubbedFadeIn.restore()

    describe '#onDialogHide', ->
      stubbedHide = null

      before ->
        stubbedHide = sinon.stub view.messageBox, 'hide', ->
        view.onDialogHide()

      it 'hides the message box', ->
        expect(stubbedHide).to.have.been.calledOnce

      after -> stubbedHide.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      fixtures.cleanUp()