define (require) ->
  $              = require 'jquery'
  ExampleList    = require '../../../application/views/examplelist'
  events         = require '../../../application/events'

  describe 'views/examplelist', ->
    stubbedRender     = null
    view              = null

    before ->
      stubbedRender = sinon.stub ExampleList.prototype, 'render', ->
      fixtures.set '<ul id="example-list"></ul>'
      view = new ExampleList
        el: $(fixtures.window().document.body).find '#example-list'

    describe 'new', ->
      it 'auto populates the collection', ->
        expect(view.collection).to.not.be.empty

      it 'renders collection', ->
        expect(stubbedRender).to.have.been.calledOnce

    describe '#select', ->
      example              = {}
      stubbedEventsTrigger = null
      stubbedCollectionGet = null

      before ->
        stubbedCollectionGet = sinon.stub view.collection, 'get', -> example
        stubbedEventsTrigger = sinon.stub events, 'trigger'

        view.select currentTarget: 'foo-bar'

      it 'triggers exampleSelected application event', ->
        expect(stubbedEventsTrigger)
          .to.have.been.calledWith 'exampleSelected', { example }

      after ->
        stubbedCollectionGet.restore()
        stubbedEventsTrigger.restore()

    after ->
      stubbedRender.restore()
      view.undelegateEvents()
      view.stopListening()
      fixtures.cleanUp()