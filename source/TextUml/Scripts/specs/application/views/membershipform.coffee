define (require) ->
  $               = require 'jquery'
  Backbone        = require 'backbone'
  MembershipForm  = require '../../../application/views/membershipform'
  events          = require '../../../application/events'

  describe 'views/membershipform', ->
    view            = null
    model           = null
    stubbedModel    = null
    successEvent    = 'dummy-event'

    before ->
      fixtures.set '<form id="form"></form>'

      model = 
        once: ->
        save: ->
      stubbedModel = sinon.stub(Backbone, 'Model').returns model

      view = new MembershipForm
        el: $(fixtures.window().document.body).find '#form'
      view.modelType = Backbone.Model
      view.successEvent = successEvent

    describe 'form submit', ->
      spiedOnce = null
      spiedSave = null

      before ->
        spiedOnce = sinon.spy model, 'once'
        spiedSave = sinon.spy model, 'save'
        view.$el.trigger 'submit'

      it 'creates model', ->
        expect(stubbedModel.calledOnce).to.be.ok

      it 'subscribes to model invalid event', ->
         expect(spiedOnce.calledWithExactly 'invalid', sinon.match.func)
          .to.be.ok

      it 'saves model', ->
         expect(spiedSave.calledOnce).to.be.ok

      after ->
        spiedOnce.restore()
        spiedSave.restore()

    describe 'persistence', ->
      stubbedSave = null

      describe 'success', ->
        successEventTriggered = null

        beforeEach (done) ->
          successEventTriggered = false
          stubbedSave = sinon.stub(model, 'save').yieldsTo 'success'
          events.on successEvent, ->
            successEventTriggered = true
            done()
          view.$el.trigger 'submit'

        it 'triggers application event', -> expect(successEventTriggered).to.be.true

      describe 'failure', ->
        stubbedHandleError = null

        beforeEach ->
          stubbedSave          = sinon.stub(model, 'save').yieldsTo 'error'
          stubbedHandleError   = sinon.stub view, 'handleError', ->
          view.$el.trigger 'submit'

        it 'handles error', -> expect(stubbedHandleError.calledOnce).to.be.ok

        afterEach -> stubbedHandleError.restore()

      afterEach -> stubbedSave.restore()

    after ->
      stubbedModel.restore()
      fixtures.cleanUp()