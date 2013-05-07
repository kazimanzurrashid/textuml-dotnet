define (require) ->
  Condition = require '../../../../../application/uml/language/sequence/condition'

  describe 'uml/language/sequence/condition', ->
    handler = null

    before -> handler = new Condition

    describe '#handles', ->
      context = null
      result = null

      describe 'alt', ->
        spiedAddIf = null

        before ->
          context =
            line: 'alt morning'
            addIf: (label) ->

          spiedAddIf = sinon.spy context, 'addIf'

          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds if block to context', ->
          expect(spiedAddIf).to.have.been.calledWith 'morning'

      describe 'else', ->
        spiedAddElse = null

        before ->
          context =
            line: 'else noon'
            addElse: (label) ->

          spiedAddElse = sinon.spy context, 'addElse'

          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds else block to context', ->
          expect(spiedAddElse).to.have.been.calledWith 'noon'

      describe 'invalid', ->
        before ->
          context = line: 'this is an invalid condition'
          result = handler.handles context

        it 'does not handle', -> expect(result).to.not.be.ok