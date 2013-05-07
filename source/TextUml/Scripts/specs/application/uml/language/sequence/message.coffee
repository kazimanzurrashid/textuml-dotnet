define (require) ->
  Participant     = require '../../../../../application/uml/models/sequence/participant'
  Message         = require '../../../../../application/uml/language/sequence/message'

  describe 'uml/language/sequence/message', ->
    context             = null
    spiedAddMessage     = null
    handler             = null

    beforeEach ->
      handler = new Message
      context =
        line: ''
        addMessage: (sender, receiver, name, async, callReturn) ->
        findOrCreateParticipant: (identifier) ->
      spiedAddMessage = sinon.spy context, 'addMessage'

    describe '#handles', ->
      sender      = null
      receiver    = null
      result      = null

      describe 'A -> B: Test', ->
        beforeEach ->
          sender      = new Participant
          receiver    = new Participant

          stubbedFindOrCreate = sinon.stub context, 'findOrCreateParticipant'
          stubbedFindOrCreate.withArgs('A').returns sender
          stubbedFindOrCreate.withArgs('B').returns receiver

          context.line = 'A -> B: Test'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds message to context', ->
          expect(spiedAddMessage)
            .to.have.been.calledWith sender, receiver, 'Test', false, false

      describe 'A <-- B: Test result', ->
        beforeEach ->
          sender      = new Participant
          receiver    = new Participant

          stubbedFindOrCreate = sinon.stub context, 'findOrCreateParticipant'
          stubbedFindOrCreate.withArgs('A').returns receiver
          stubbedFindOrCreate.withArgs('B').returns sender

          context.line = 'A <-- B: Test result'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds message to context', ->
          expect(spiedAddMessage)
            .to.have.been.calledWith sender, receiver, 'Test result', false, true

      describe 'A ->> B: Test', ->
        beforeEach ->
          sender      = new Participant
          receiver    = new Participant

          stubbedFindOrCreate = sinon.stub context, 'findOrCreateParticipant'
          stubbedFindOrCreate.withArgs('A').returns sender
          stubbedFindOrCreate.withArgs('B').returns receiver

          context.line = 'A ->> B: Test'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds message to context', ->
          expect(spiedAddMessage)
            .to.have.been.calledWith sender, receiver, 'Test', true, false

      describe 'A <<--- B: Test result', ->
        beforeEach ->
          sender      = new Participant
          receiver    = new Participant

          stubbedFindOrCreate = sinon.stub context, 'findOrCreateParticipant'
          stubbedFindOrCreate.withArgs('A').returns receiver
          stubbedFindOrCreate.withArgs('B').returns sender

          context.line = 'A <<-- B: Test result'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds message to context', ->
          expect(spiedAddMessage)
            .to.have.been.calledWith sender, receiver, 'Test result', true, true

      describe 'invalid', ->
        beforeEach ->
          context = line: 'This is an invalid message'
          result = handler.handles context

        it 'does not handle', -> expect(result).to.not.be.ok