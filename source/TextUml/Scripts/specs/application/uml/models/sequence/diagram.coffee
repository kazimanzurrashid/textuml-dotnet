define (require) ->
  Diagram = require '../../../../../application/uml/models/sequence/diagram'

  describe 'uml/models/sequence/diagram', ->

    describe 'new', ->
      diagram = null

      beforeEach -> diagram = new Diagram

      it 'title is not set', -> expect(diagram.title).to.be.undefined

      it 'participants are empty', -> expect(diagram.participants).to.be.empty

      it 'commands are empty', -> expect(diagram.command).to.be.empty