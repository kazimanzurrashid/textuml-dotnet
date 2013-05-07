define (require) ->
  End = require '../../../../../application/uml/language/sequence/end'

  describe 'uml/language/sequence/end', ->
    handler = null

    beforeEach -> handler = new End

    describe '#handles', ->
      context     = null
      result      = null

      describe 'valid', ->
        spiedCloseParent = null

        beforeEach ->
          context = 
            line: 'end'
            closeParent: ->

          spiedCloseParent = sinon.spy context, 'closeParent'

          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'closes parent command of context', ->
          expect(context.closeParent).to.have.been.called
          
      describe 'invalid', ->
        beforeEach ->
          context = line: 'This is an invalid end'
          result = handler.handles context

        it 'does not handle', -> expect(result).to.not.be.ok