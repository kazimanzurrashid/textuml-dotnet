define (require) ->
  $           = require 'jquery'
  Navigation  = require '../../../application/views/navigation'
  events      = require '../../../application/events'
  
  describe 'views/navigation', ->
    view = null

    before ->
      fixtures.set """
        <div id="navigation">
          <ul class="nav">
            <li class="test-1">
              <a  data-command="dummy-event" href="javascript:;">Test 1</a>
            </li>
            <li class="test-2">
              <a href="javascript:;">Test 2</a>
            </li>
          </ul>
        </div>
        """
      view = new Navigation
        el: $(fixtures.window().document.body).find '#navigation'

    describe 'menu item clicks', ->
      stubbedTrigger = null
      
      beforeEach -> stubbedTrigger = sinon.stub events, 'trigger', ->

      describe 'has data-command attribute', ->
        beforeEach -> view.$('a').first().trigger 'click'

        it 'triggers application event', ->
          expect(stubbedTrigger).to.have.been.calledWith 'dummy-event'

      describe 'no data-command attribute', ->
        beforeEach -> view.$('a').last().trigger 'click'

        it 'does not trigger any event', ->
          expect(stubbedTrigger).to.not.have.been.called

      afterEach -> stubbedTrigger.restore()

    after ->
      view.undelegateEvents()
      view.stopListening()
      fixtures.cleanUp()