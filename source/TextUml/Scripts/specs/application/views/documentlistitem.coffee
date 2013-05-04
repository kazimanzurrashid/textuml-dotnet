define (require) ->
  $                   = require 'jquery'
  DocumentListItem    = require '../../../application/views/documentlistitem'

  describe 'views/documentlistitem', ->
    stubbedListenTo       = null
    stubbedTemplate       = null
    model                 = null
    view                  = null

    before ->
      stubbedListenTo = sinon.stub DocumentListItem.prototype, 'listenTo', ->

      stubbedTemplate = sinon.stub()
      model =
        toJSON    : ->
        get       : (attr) ->
        save      : ->
        destroy   : ->

      view = new DocumentListItem { model, template: stubbedTemplate }

    describe 'new', ->
      it 'subscribes to model change event', ->
        expect(stubbedListenTo)
          .to.have.been.calledWith model, 'change', view.render

      it 'subscribes to model remove and destroy event', ->
        expect(stubbedListenTo)
          .to.have.been.calledWith model, 'remove destroy', view.remove

    describe '#render', ->
      html              = '<li>test doc</li>'
      stubbedToJSON     = null
      stubbedHtml       = null

      before ->
        stubbedTemplate.returns html
        stubbedToJSON = sinon.stub view.model, 'toJSON', -> {}
        stubbedHtml   = sinon.stub view.$el, 'html', ->

        view.render()

      it 'sets element html', ->
        expect(stubbedHtml).to.have.been.calledWith html

      after ->
        stubbedTemplate.reset()
        stubbedToJSON.restore()
        stubbedHtml.restore()

    describe '#remove', ->

      describe 'with notification', ->
        stubbedTrigger = null
        stubbedFadeOut = null

        before ->
         stubbedTrigger = sinon.stub view, 'trigger', ->
         stubbedFadeOut = sinon.stub view.$el, 'fadeOut', ->
         view.remove true

        it 'triggers removing event', ->
          expect(stubbedTrigger).to.have.been.calledWith 'removing'

        it 'fade outs the element', ->
          expect(stubbedFadeOut).to.have.been.called

        after ->
          stubbedTrigger.restore()
          stubbedFadeOut.restore()

    describe '#showDisplay', ->
      stubbedSelector     = null
      stubbedEdit         = null
      stubbedDisplay      = null

      before ->
        edit                = hide: ->
        display             = show: ->
        stubbedEdit         = sinon.stub edit, 'hide', ->
        stubbedDisplay      = sinon.stub display, 'show', ->
        stubbedSelector     = sinon.stub view, '$'
        stubbedSelector.withArgs('.edit').returns edit
        stubbedSelector.withArgs('.display').returns display

        view.showDisplay()

      it 'hides edit', -> expect(stubbedEdit).to.have.been.calledOnce

      it 'shows display', -> expect(stubbedDisplay).to.have.been.calledOnce

      after -> stubbedSelector.restore()

    describe '#showEdit', ->
      title               = 'test doc'
      stubbedSelector     = null
      stubbedDisplay      = null
      stubbedEdit         = null
      stubbedFind         = null
      stubbedVal          = null
      stubbedSelect       = null
      stubbedFocus        = null
      stubbedModelGet     = null

      before ->
        display  = hide: ->
        edit =
          show: ->
          find: (selector) ->
          val: (value) ->
          select: ->
          focus: ->

        stubbedFind         = sinon.stub edit, 'find', -> edit
        stubbedVal          = sinon.stub edit, 'val', -> edit
        stubbedSelect       = sinon.stub edit, 'select', -> edit
        stubbedFocus        = sinon.stub edit, 'focus', -> edit
        stubbedDisplay      = sinon.stub display, 'hide', ->
        stubbedEdit         = sinon.stub edit, 'show', -> edit
        stubbedSelector     = sinon.stub view, '$'

        stubbedSelector.withArgs('.display').returns display
        stubbedSelector.withArgs('.edit').returns edit

        stubbedModelGet = sinon.stub view.model, 'get'
        stubbedModelGet.withArgs('title').returns title

        view.showEdit()

      it 'hides display', ->
        expect(stubbedDisplay).to.have.been.calledOnce

      it 'shows edit', ->
        expect(stubbedEdit).to.have.been.calledOnce

      it 'sets title as input value', ->
        expect(stubbedVal).to.have.been.calledWith title
        
      it 'selects the input', ->
        expect(stubbedSelect).to.have.been.calledOnce

      it 'sets focus to input', ->
        expect(stubbedFocus).to.have.been.calledOnce

      after ->
        stubbedModelGet.restore()
        stubbedSelector.restore()

    describe '#onEdit', ->
      stubbedShowEdit = null

      before -> 
        stubbedShowEdit = sinon.stub view, 'showEdit', ->

        view.onEdit
          preventDefault    : ->
          stopPropagation   : ->

      it 'executes #showEdit', ->
        expect(stubbedShowEdit).to.have.been.calledOnce

      after -> stubbedShowEdit.restore()

    describe '#onCancel', ->
      stubbedShowDisplay = null

      before -> 
        stubbedShowDisplay = sinon.stub view, 'showDisplay', ->

        view.onCancel
          preventDefault    : ->
          stopPropagation   : ->

      it 'executes #showDisplay', ->
        expect(stubbedShowDisplay).to.have.been.calledOnce

      after -> stubbedShowDisplay.restore()

    describe '#onUpdateOrCancel', ->
      stubbedShowDisplay = null

      before ->
        stubbedShowDisplay = sinon.stub view, 'showDisplay', ->

      describe 'enter key', ->
        title               = 'test doc'
        stubbedModelSave    = null

        before ->
          stubbedModelGet     = sinon.stub view.model, 'get', ->
          stubbedModelSave    = sinon.stub view.model, 'save', ->

          input = $ '<input/>', value: title

          view.onUpdateOrCancel
            stopPropagation   : ->
            preventDefault    : ->
            which             : 13
            currentTarget     : input

        it 'saves the model', ->
          expect(stubbedModelSave).to.have.been.calledWith { title }

        it 'shows display', ->
          expect(stubbedShowDisplay).to.have.been.calledOnce

        after -> stubbedShowDisplay.reset()

      describe 'escape key', ->
        before ->
          view.onUpdateOrCancel
            stopPropagation: ->
            preventDefault: ->
            which: 27

        it 'shows display', ->
          expect(stubbedShowDisplay).to.have.been.calledOnce

        after -> stubbedShowDisplay.reset()

      after -> stubbedShowDisplay.restore()

    describe '#onDestroy', ->
      stubbedConfirm          = null
      stubbedModelDestroy     = null

      before ->
        stubbedConfirm = sinon.stub($, 'confirm').yieldsTo 'ok'
        stubbedModelDestroy = sinon.stub view.model, 'destroy', ->
        
        view.onDestroy
          preventDefault    : ->
          stopPropagation   : ->

      it 'asks for confirmation', -> expect(stubbedConfirm).to.have.been.calledOnce

      it 'destroys the model', -> expect(stubbedModelDestroy).to.have.been.calledOnce

      after -> stubbedConfirm.restore()
        
    after -> stubbedListenTo.restore()