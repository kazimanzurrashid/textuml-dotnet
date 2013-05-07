define (require) ->
  Comment = require '../../../../../application/uml/language/sequence/comment'
  Title           = require '../../../../../application/uml/language/sequence/title'
  Participant     = require '../../../../../application/uml/language/sequence/participant'
  Message         = require '../../../../../application/uml/language/sequence/message'
  Group           = require '../../../../../application/uml/language/sequence/group'
  Condition       = require '../../../../../application/uml/language/sequence/condition'
  End             = require '../../../../../application/uml/language/sequence/end'
  Parser          = require '../../../../../application/uml/language/sequence/parser'

  describe 'uml/language/sequence/parser', ->
    parser = null

    describe 'new', ->
      before -> parser = new Parser

      describe 'default handlers', ->

        it 'creates comment handler', ->
          expect(parser.handlers[0]).to.be.an.instanceof Comment

        it 'creates title handler', ->
          expect(parser.handlers[1]).to.be.an.instanceof Title

        it 'creates participant handler', ->
          expect(parser.handlers[2]).to.be.an.instanceof Participant

        it 'creates message handler', ->
          expect(parser.handlers[3]).to.be.an.instanceof Message

        it 'creates group handler', ->
          expect(parser.handlers[4]).to.be.an.instanceof Group

        it 'creates condition handler', ->
          expect(parser.handlers[5]).to.be.an.instanceof Condition

        it 'creates end handler', ->
          expect(parser.handlers[6]).to.be.an.instanceof End

    describe '#parse', ->

      describe 'duplicate empty lines', ->
        originalContextType = null
        stubbedContextType = null

        before ->
          originalContextType = Parser::contextType
          stubbedContextType = sinon.stub().returns {}
          Parser::contextType = stubbedContextType
          parser = new Parser
          parser.parse 'line1\n\nline2\nline3'

        it 'discards', ->
          expect(stubbedContextType).to.have.been.calledWith 'line1\nline2\nline3'

        after -> Parser::contextType = originalContextType

      describe 'onStart callback', ->
        spiedOnStart = null

        before ->
          spiedOnStart = sinon.spy()
          parser = new Parser
            callbacks:
              onStart: spiedOnStart
          parser.parse ''

        it 'triggers the callback', ->
          expect(spiedOnStart).to.have.been.calledOnce

      describe 'onComplete callback', ->

        describe 'empty input', ->
          spiedOnComplete = null

          before ->
            spiedOnComplete = sinon.spy()
            parser = new Parser
              callbacks:
                onComplete: spiedOnComplete
            parser.parse ''

          it 'triggers the callback', ->
            expect(spiedOnComplete).to.have.been.calledWith()

        describe 'valid input', ->
          originalContextType     = null
          stubbedContextType      = null
          diagram                 = null
          spiedOnComplete         = null

          before ->
            diagram =
              participants: [sinon.stub()]

            context =
              updateLineInfo: ->
              getLineNumber: -> 0
              done: ->
              getDiagram: -> diagram

            originalContextType = Parser::contextType
            stubbedContextType = sinon.stub().returns context
            Parser::contextType = stubbedContextType

            spiedOnComplete = sinon.spy()

            parser = new Parser
              callbacks:
                onComplete: spiedOnComplete

            parser.handlers = []
            parser.parse 'line1\nline2\nline3'

          it 'triggers the callback with the parsed diagram', ->
            expect(spiedOnComplete).to.have.been.calledWith diagram

          after -> Parser::contextType = originalContextType

      describe 'onWarning callback', ->

        describe 'unknown syntax', ->
          spiedOnWarning = null

          before ->
            spiedOnWarning = sinon.spy()
            parser = new Parser
              callbacks:
                onWarning: spiedOnWarning
            parser.parse 'test input'

          it 'triggers the callback', ->
            expect(spiedOnWarning)
              .to.have.been.calledWithMatch /Warning on line 1/

      describe 'onError callback', ->

        describe 'on exception', ->

          spiedOnError = null
          exception = null

          before ->
            exception = new Error
            spiedOnError = sinon.spy()
            parser = new Parser
              callbacks:
                onError: spiedOnError
            parser.handlers = [ handles: -> throw exception ]
            parser.parse 'test input'

          it 'triggers the callback', ->
            expect(spiedOnError)
              .to.have.been.calledWith exception