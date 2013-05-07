define (require) ->
  Participant = require '../../../../../application/uml/language/sequence/participant'

  describe 'uml/language/sequence/participant', ->

    handler = null

    beforeEach ->
      handler = new Participant

    describe '#handles', ->
      context     = null
      result      = null

      describe 'with name and alias', ->
        spiedAddParticipant = null

        beforeEach ->
          context =
            line: 'participant "A very long name" as A'
            findParticipant: (identifier) ->
            addParticipant: (name, alias) ->

          spiedAddParticipant = sinon.spy context, 'addParticipant'

          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds participant to context', ->
          expect(spiedAddParticipant).to.have.been.calledWith 'A very long name', 'A'

      describe 'only name', ->
        spiedAddParticipant = null

        beforeEach ->
          context =
            line: 'participant A'
            findParticipant: (identifier) ->
            addParticipant: (name, alias) ->

          spiedAddParticipant = sinon.spy context, 'addParticipant'

          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds participant to context', ->
          expect(spiedAddParticipant).to.have.been.calledWith 'A', undefined

      describe 'duplicate name', ->
        stubbedFindParticipant = null

        beforeEach ->
          context =
            line: 'participant A'
            getLineNumber: -> 1
            findParticipant: (identifier) ->

          sinon.stub context, 'findParticipant', -> true

        it 'throws', ->
          expect ->
            handler.handles context
          .to.throw 'Error on line 1, participant with name "A" already exists.'

      describe 'duplicate alias', ->
        beforeEach ->
          context =
            line: 'participant "long name" as A'
            getLineNumber: -> 1
            findParticipant: (identifier) ->

          stubbedFindParticipant = sinon.stub context, 'findParticipant'
          stubbedFindParticipant.withArgs('A').returns true

        it 'throws', ->
          expect ->
            handler.handles context
          .to.throw 'Error on line 1, participant with alias "A" already exists.'