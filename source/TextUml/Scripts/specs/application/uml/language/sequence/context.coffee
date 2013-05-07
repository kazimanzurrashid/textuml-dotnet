define (require) ->
  Composite     = require '../../../../../application/uml/models/sequence/composite'
  Context       = require '../../../../../application/uml/language/sequence/context'

  describe 'uml/language/sequence/context', ->
    context = null

    beforeEach -> context = new Context

    describe 'new', ->
      beforeEach -> context = new Context 'A -> B: Test'

      it 'has same payload', -> expect(context.payload).to.equal 'A -> B: Test'

      it 'does not have title', -> expect(context.title).to.be.undefined

      it 'has empty participants', -> expect(context.participants).to.be.empty

      it 'has empty commands', -> expect(context.commands).to.be.empty

      it 'does not have any line', -> expect(context.line).to.be.undefined

      it 'does not have any index', -> expect(context.index).to.be.undefined

      it 'does not have parent command', ->
        expect(context.parentCommand).to.be.undefined

    describe '#getLineNumber', ->
      lineNumber = null

      beforeEach -> lineNumber = context.getLineNumber()
        
      it 'returns +1 of index', -> expect(lineNumber).to.equal 1

    describe '#updateLineInfo', ->
      beforeEach -> context.updateLineInfo 'A -> B: Test', 1

      it 'sets line', -> expect(context.line).to.equal 'A -> B: Test'

      it 'sets index', -> expect(context.index).to.equal 1

    describe '#setTitle', ->
      title = null

      beforeEach -> title = context.setTitle 'Test Sequence'

      it 'returns new title', -> expect(title).to.be.ok

      it 'sets title text', -> expect(title.text).to.equal 'Test Sequence'

    describe '#addParticipant', ->
      participant = null

      beforeEach ->
        participant = context.addParticipant 'A very long name', 'A'

      it 'returns new participant', -> expect(participant).to.be.ok

      it 'sets participant name', ->
        expect(participant.name).to.equal 'A very long name'

      it 'sets participant alias', -> expect(participant.alias).to.equal 'A'

      it 'adds to participants to collection', ->
        expect(context.participants).to.contain participant

    describe '#addMessage', ->
      sender      = null
      receiver    = null
      message     = null

      beforeEach ->
        sender = {}
        receiver = {}
        message = context.addMessage sender, receiver, 'test', true, true

      it 'returns new message', -> expect(message).to.be.ok

      it 'sets sender', -> expect(message.sender).to.deep.equal sender

      it 'sets receiver', -> expect(message.receiver).to.deep.equal receiver

      it 'sets name', -> expect(message.name).to.equal 'test'

      it 'sets async', -> expect(message.async).to.be.true

      it 'sets call return', -> expect(message.callReturn).to.be.true

      describe 'without parent', ->

        it 'adds to commands to collection', ->
          expect(context.commands).to.contain message

      describe 'with parent', ->
        parent = null

        beforeEach ->
          parent = new Composite
          context.parentCommand = parent
          message = context.addMessage sender, receiver, 'test', true, true

        it 'does not add to commands collection', ->
          expect(context.commands).to.not.contain message

        it 'adds to parent command child collection', ->
          expect(parent.children).to.contain message

    describe '#addGroup', ->
      group = null

      beforeEach -> group = context.addGroup 'opt', 'condition'
      
      it 'returns new group', -> expect(group).to.be.ok

      it 'sets type', -> expect(group.type).to.equal 'opt'

      it 'sets label', -> expect(group.label).to.equal 'condition'

      it 'sets group as parent command', ->
        expect(context.parentCommand).to.deep.equal group

      describe 'without parent', ->
        it 'adds to commands collection', ->
          expect(context.commands).to.contain group

      describe 'with parent', ->
        parent = null

        beforeEach ->
          parent = new Composite
          context.parentCommand = parent
          group = context.addGroup 'opt', 'condition'

        it 'does not add to commands collection', ->
          expect(context.commands).to.not.contain group

        it 'adds to parent command child collection', ->
          expect(parent.children).to.contain group

    describe '#addIf', ->
      ifGroup = null

      beforeEach -> ifGroup = context.addIf 'condition 1'
      
      it 'returns new group', -> expect(ifGroup).to.be.ok

      it 'does not set type', -> expect(ifGroup.type).to.be.undefined

      it 'sets label', -> expect(ifGroup.label).to.equal 'condition 1'

      it 'sets group as parent command', ->
        expect(context.parentCommand).to.deep.equal ifGroup

      describe 'without parent', ->
        it 'adds condition to commands collection', ->
          expect(context.commands).to.contain ifGroup.parent

      describe 'with parent', ->
        parent = null

        beforeEach ->
          parent = new Composite
          context.parentCommand = parent
          ifGroup = context.addIf 'condition 1'

        it 'does not add condition to commands collection', ->
          expect(context.commands).to.not.contain ifGroup.parent

        it 'adds condition to parent command child collection', ->
          expect(parent.children).to.contain ifGroup.parent

    describe '#addElse', ->
      elseGroup = null

      describe 'if group is set', ->
        beforeEach ->
          context.addIf 'condition 1'
          elseGroup = context.addElse 'condition 2'
        
        it 'returns new group', -> expect(elseGroup).to.be.ok

        it 'does not set type', -> expect(elseGroup.type).to.be.undefined

        it 'sets label', -> expect(elseGroup.label).to.equal 'condition 2'

        it 'sets group as parent command', ->
          expect(context.parentCommand).to.deep.equal elseGroup

      describe 'if group is not set', ->
        it 'throws', ->
          expect ->
            context.addElse 'condition 2'
          .to.throw 'Error on line 1, cannot use \"else\" without an \"alt\".'

    describe '#closeParent', ->
      describe 'parent command is set', ->
        beforeEach ->
          context.parentCommand = new Composite
          context.closeParent()

        it 'parent command is no longer set', ->
          expect(context.parentCommand).to.be.undefined

      describe 'parent command is not set', ->
        it 'throws', ->
          expect ->
            context.closeParent()
          .to.throw 'Error on line 1, cannot end without a group start.'

    describe '#done', ->
      describe 'parent command is set', ->
        beforeEach ->
          context.parentCommand = new Composite

         it 'throws', ->
            expect ->
              context.done()
            .to.throw 'Error! One or more group(s) is not properly closed, please ' +
              'add the missing \"end\" for unclosed group(s).'

    describe 'getDiagram', ->
      diagram = null

      beforeEach -> diagram = context.getDiagram()

      it 'returns new diagram', -> expect(diagram).to.be.ok

      it 'has same title', -> expect(diagram.title).to.equal context.title

      it 'has same participants', -> expect(diagram.participants).to.equal context.participants

      it 'has same commands', -> expect(diagram.commands).to.equal context.commands