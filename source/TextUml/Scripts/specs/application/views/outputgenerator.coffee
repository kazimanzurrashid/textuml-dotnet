define (require) ->
  $                 = require 'jquery'
  OutputGenerator   = require '../../../application/views/outputgenerator'
  events            = require '../../../application/events'

  describe 'views/outputgenerator', ->
    spiedListenTo = null
    view          = null

    before ->
      fixtures.set '<textarea id="output-text-area"></textarea>'

      spiedListenTo = sinon.spy OutputGenerator.prototype, 'listenTo'
      view = new OutputGenerator
        el: $(fixtures.window().document.body).find '#output-text-area'

    describe 'new', ->
      it 'subscribes to parseStarted application event', -> 
        expect(spiedListenTo)
          .to.be.have.been.calledWith events, 'parseStarted', view.onParseStarted

      it 'subscribes to parseWarning and parseError application event', -> 
        expect(spiedListenTo)
          .to.be.have.been.calledWith events, 'parseWarning parseError', view.onParseWarningOrError

      it 'subscribes to parseCompleted application event', -> 
        expect(spiedListenTo)
          .to.be.have.been.calledWith events, 'parseCompleted', view.onParseCompleted

    describe 'onParseStarted', ->
      before ->
        view.$el.val 'foo bar'
        view.onParseStarted()

      it 'clears the content', -> expect(view.$el).to.have.value ''

    describe 'onParseWarningOrError', ->
      before ->
        view.$el.val '1st warning/error'
        view.onParseWarningOrError message: '2nd warning/error'

      it 'appends to the content', ->
        expect(view.$el).to.have.value '1st warning/error\n2nd warning/error'

    describe 'onParseCompleted', ->
      beforeEach -> view.$el.val 'some message'

      describe 'with diagram', ->
        beforeEach -> view.onParseCompleted diagram: sinon.stub()

        it 'appends success message to the content', ->
          expect(view.$el)
            .to.have.value 'some message\nDiagram generated successfully.'

      describe 'without diagram', ->
        beforeEach -> view.onParseCompleted()

        it 'does nothing', -> expect(view.$el).to.have.value 'some message'

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      fixtures.cleanUp()