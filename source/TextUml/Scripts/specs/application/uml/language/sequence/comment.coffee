define (require) ->
  Comment = require '../../../../../application/uml/language/sequence/comment'

  describe 'uml/language/sequence/comment', ->
    handler = null

    beforeEach -> handler = new Comment

    describe '#handles', ->
      context   = null
      result    = null

      describe 'valid', ->
        beforeEach ->
          context = line: '\' This is a comment'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

      describe 'invalid', ->
        beforeEach ->
          context = line: 'This is an invalid comment'
          result = handler.handles context

        it 'does not handle', -> expect(result).to.not.be.ok