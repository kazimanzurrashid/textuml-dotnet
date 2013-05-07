define (require) ->
  Group = require '../../../../../application/uml/language/sequence/group'

  describe 'uml/language/sequence/group', ->
    context           = null
    spiedAddGroup     = null
    handler           = null

    beforeEach ->
      handler = new Group
      context =
        line: ''
        addGroup: (type, label) ->
      spiedAddGroup = sinon.spy context, 'addGroup'

    describe '#handles', ->
      result = null

      describe 'opt', ->
        beforeEach ->
          context.line = 'opt leap year'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds group to context', ->
          expect(spiedAddGroup).to.have.been.calledWith 'opt', 'leap year'

      describe 'loop', ->
        beforeEach ->
          context.line = 'loop 10 times'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'adds group to context', ->
          expect(spiedAddGroup).to.have.been.calledWith 'loop', '10 times'

      describe 'invalid', ->
        beforeEach ->
          context.line = 'this is an invalid group'
          result = handler.handles context

        it 'does not handle', -> expect(result).to.not.be.ok