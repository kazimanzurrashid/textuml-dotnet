define (require) ->
  Participant     = require '../../../../../application/uml/models/sequence/participant'
  Message         = require '../../../../../application/uml/models/sequence/message'

  describe 'uml/models/sequence/message', ->
    message = null

    describe '#selfInvoking', ->

      describe 'same sender and receiver', ->
        beforeEach ->
          participant     = new Participant
          message         = new Message participant, participant

        it 'returns true', -> expect(message.selfInvoking()).to.be.ok

      describe 'different sender and receiver', ->
        beforeEach ->
          sender      = new Participant
          receiver    = new Participant
          message     = new Message sender, receiver

        it 'returns false', -> expect(message.selfInvoking()).to.not.be.ok