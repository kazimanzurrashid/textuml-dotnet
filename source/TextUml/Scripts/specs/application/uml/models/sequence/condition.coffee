define (require) ->
  Condition = require '../../../../../application/uml/models/sequence/condition'

  describe 'uml/models/sequence/condition', ->
    condition = null

    beforeEach -> condition = new Condition

    describe '#createIfGroup', ->
      ifGroup = null

      beforeEach -> ifGroup = condition.createIfGroup 'true'

      it 'returns new group', -> expect(ifGroup).to.be.ok

      it 'group has label', -> expect(ifGroup.label).to.equal 'true'

      it 'group has condition as parent', ->
        expect(ifGroup.parent).to.deep.equal condition

    describe '#addElseGroup', ->
      elseGroup = null

      beforeEach -> elseGroup = condition.addElseGroup 'false'

      it 'returns new group', -> expect(elseGroup).to.be.ok

      it 'group has label', -> expect(elseGroup.label).to.equal 'false'

      it 'group has condition as parent', ->
        expect(elseGroup.parent).to.deep.equal condition

    describe '#getIfGroup', ->
      ifGroup = null

      beforeEach ->
        condition.createIfGroup 'morning'
        condition.addElseGroup 'noon'
        condition.addElseGroup 'evening'

        ifGroup = condition.getIfGroup()

      it 'returns first item of child collection', ->
        expect(ifGroup).to.deep.equal condition.children[0]

    describe '#getElseGroups', ->
      elseGroups = null

      beforeEach ->
        condition.createIfGroup 'morning'
        condition.addElseGroup 'noon'
        condition.addElseGroup 'evening'

        elseGroups = condition.getElseGroups()

      it 'returns from second item of child collection', ->
        expect(elseGroups[0]).to.deep.equal condition.children[1]
        expect(elseGroups[1]).to.deep.equal condition.children[2]