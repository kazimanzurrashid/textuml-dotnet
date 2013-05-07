define (require) ->
  Base          = require '../../../../../application/uml/models/sequence/base'
  Composite     = require '../../../../../application/uml/models/sequence/composite'

  describe 'uml/models/sequence/base', ->

    describe 'new', ->
      base = null

      describe 'without parent', ->
        before -> base = new Base

        it 'has no parent', -> expect(base.parent).to.not.be.ok

      describe 'with parent', ->
        parent = null

        before ->
          parent = new Composite
          base = new Base parent

        it 'has same parent', -> expect(base.parent).to.deep.equal parent

    describe '#setParent', ->
      base = null
      
      describe 'new', ->
        parent = null

        beforeEach ->
          parent    = new Composite
          base      = new Base
          base.setParent parent
          
        it 'appends itself in parent child collection', ->
          expect(parent.children).to.contain base
        
      describe 'existing', ->
        oldParent = null
        newParent = null

        beforeEach ->
          oldParent     = new Composite
          newParent     = new Composite
          base          = new Base oldParent
          base.setParent newParent

        it 'removes itself from old parent child collection', ->
          expect(oldParent.children).to.not.contain base