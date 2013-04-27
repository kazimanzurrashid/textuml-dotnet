define (require) ->
  $           = require 'jquery'
  Navigation  = require '../../../application/views/navigation'
  events      = require '../../../application/events'
  
  describe 'views/navigation', ->
    navigation = null

    before ->
      fixtures.load '/navigation.html'
      navigation = new Navigation
        el: $(fixtures.window().document.body).find '#navigation'

    describe 'application events', ->
      stubbedTrigger = null
      
      beforeEach ->
        stubbedTrigger = sinon.stub events, 'trigger'

      describe 'menu item clicks', ->

        describe 'has data-command attribute', ->
          beforeEach -> navigation.$el.find('a').first().trigger 'click'

          it 'triggers event', ->
            expect(stubbedTrigger.calledWith 'dummy-event').to.be.ok

        describe 'no data-command attribute', ->
          beforeEach -> navigation.$el.find('a').last().trigger 'click'

          it 'does not trigger any event', ->
            expect(stubbedTrigger.called).to.not.be.ok

      afterEach -> stubbedTrigger.restore()

    after -> fixtures.cleanUp()