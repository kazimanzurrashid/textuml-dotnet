define (require) ->
  Title = require '../../../../../application/uml/language/sequence/title'

  describe 'uml/language/sequence/title', ->
    handler = null
    context = null

    beforeEach ->
      handler = new Title
      context =
        line            : ''
        title           : null
        participants    : []
        commands        : []
        getLineNumber   : -> 2
        setTitle        : (value)->

    describe '#handles', ->
      errorMessage = 'Error on line 2, title must be defined before any other instruction.'
      result = null

      describe 'with valid title', ->
        spiedSetTitle = null

        beforeEach ->
          context.line      = 'title Dummy flow'
          spiedSetTitle     = sinon.spy context, 'setTitle'
          result = handler.handles context

        it 'handles', -> expect(result).to.be.ok

        it 'sets title', ->
          expect(spiedSetTitle).to.have.been.calledWith 'Dummy flow'

      describe 'title already assigned', ->
        beforeEach ->
          context.title = 'Test title'
          context.line = 'title Dummy Flow'

        it 'throws', ->
          expect ->
            handler.handles context
          .to.throw errorMessage

      describe 'participants already assigned', ->
        beforeEach ->
          context.participants.push 'Component A'
          context.line = 'title Dummy flow'

        it 'throws', ->
          expect ->
            handler.handles context
          .to.throw errorMessage

      describe 'commands already assigned', ->
        beforeEach ->
          context.commands.push 'A -> B: Test'
          context.line = 'title Dummy flow'

        it 'throws', ->
          expect ->
            handler.handles context
          .to.throw errorMessage