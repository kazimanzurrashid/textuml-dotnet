define (require) ->
  $                 = require 'jquery'
  Backbone          = require 'backbone'
  MembershipForm    = require '../../../application/views/membershipform'
  Helpers           = require '../../../application/views/helpers'
  events            = require '../../../application/events'

  describe 'views/membershipform', ->
    view = null

    before ->
      fixtures.set '<form id="form"></form>'
      view = new MembershipForm
        el: $(fixtures.window().document.body).find '#form'

    describe '#onSubmit', ->
      model                                 = null
      stubbedModel                          = null
      stubbedHideSummaryError               = null
      stubbedHideFieldErrors                = null
      stubbedSubscribeModelInvalidEvent     = null
      stubbedSerializeFields                = null

      before ->
        model = save: ->
        stubbedModel = sinon.stub(Backbone, 'Model').returns model
        view.modelType = Backbone.Model

        stubbedSubscribeModelInvalidEvent = sinon.stub Helpers,
          'subscribeModelInvalidEvent',
          ->

        stubbedHideSummaryError = sinon.stub view.$el,
          'hideSummaryError',
          -> view.$el

        stubbedHideFieldErrors = sinon.stub view.$el,
          'hideFieldErrors',
          -> view.$el

        stubbedSerializeFields = sinon.stub view.$el,
          'serializeFields',
          -> {}

      describe 'form submit', ->
        spiedSave = null

        before ->
          spiedSave = sinon.spy model, 'save'
          view.onSubmit preventDefault: ->

        it 'hides form errors', ->
          expect(stubbedHideSummaryError).to.have.been.called

        it 'hides field errors', ->
          expect(stubbedHideFieldErrors).to.have.been.called

        it 'creates model', -> expect(stubbedModel).to.have.been.called

        it 'subscribes to model invalid event once', ->
           expect(stubbedSubscribeModelInvalidEvent)
            .to.have.been.calledWith model, view.$el

        it 'serializes form fields', ->
          expect(stubbedSerializeFields).to.have.been.called

        it 'saves model', -> expect(spiedSave).to.have.been.CalledOnce

        after -> spiedSave.restore()

      describe 'persistence', ->

        describe 'success', ->
          successEvent            = 'dummy-event'
          stubbedSave             = null
          stubbedEventsTrigger    = null

          before ->
            stubbedSave           = sinon.stub(model, 'save').yieldsTo 'success'
            stubbedEventsTrigger  = sinon.stub events, 'trigger', ->

            view.successEvent     = successEvent
            view.onSubmit preventDefault: ->

          it 'triggers application event', ->
            expect(stubbedEventsTrigger).to.have.been.calledWith successEvent

          after ->
            stubbedSave.restore()
            stubbedEventsTrigger.restore()

        describe 'error', ->
          stubbedSave             = null
          stubbedHandleError      = null

          before ->
            stubbedSave          = sinon.stub(model, 'save').yieldsTo 'error'
            stubbedHandleError   = sinon.stub view, 'handleError', ->
            view.onSubmit preventDefault: ->

          it 'handles error', ->
            expect(stubbedHandleError).to.have.been.CalledOnce

          after ->
            stubbedSave.restore()
            stubbedHandleError.restore()

      after ->
        stubbedSubscribeModelInvalidEvent.restore()
        stubbedHideSummaryError.restore()
        stubbedHideFieldErrors.restore()
        stubbedSerializeFields.restore()
        stubbedModel.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      fixtures.cleanUp()