define (require) ->
  Composite = require '../../../../../application/uml/models/sequence/composite'

  describe 'uml/models/sequence/composite', ->

    describe 'new', ->
      composite = null

      beforeEach -> composite = new Composite

      it 'children is empty', -> expect(composite.children).to.be.empty