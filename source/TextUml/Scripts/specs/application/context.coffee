define (require) ->
  Context = require '../../application/context'

  describe 'context', ->
    originalDocumentsType     = null
    documentsType             = null
    context                   = null

    before ->
      originalDocumentsType = Context::documentsType

      documentsType =
        reset       : ->
        setCounts   : ->
        fetch       : ->
        fetchOne    : ->
        get         : ->
        create      : ->
        length      : 0

      Context::documentsType = sinon.stub().returns documentsType

    describe 'new', ->

      describe 'authenticated user', ->
        spiedResetCurrentDocument     = null
        spiedReset                    = null
        spiedSetCounts                = null

        before ->
          spiedResetCurrentDocument     = sinon.spy Context.prototype, 'resetCurrentDocument'
          spiedReset                    = sinon.spy documentsType, 'reset'
          spiedSetCounts                = sinon.spy documentsType, 'setCounts'

          context = new Context
            userSignedIn    : true
            documents       :
              data    : []
              count   : 0

        it 'resets current document', ->
          expect(spiedResetCurrentDocument).to.have.been.calledOnce

        it 'sets documents', ->
          expect(spiedReset).to.have.been.calledWith []

        it 'sets counts', ->
          expect(spiedSetCounts).to.have.been.calledWith 0
          
        it 'sets #signedIn to true', ->
          expect(context.isUserSignedIn()).to.be.true

        after ->
          spiedResetCurrentDocument.restore()
          spiedReset.restore()
          spiedSetCounts.restore()

      describe 'unauthenticated user', ->
        spiedResetCurrentDocument = null

        before ->
          spiedResetCurrentDocument     = sinon.spy Context.prototype, 'resetCurrentDocument'
          context                       = new Context userSignedIn: false

        it 'resets current document', ->
          expect(spiedResetCurrentDocument).to.have.been.calledOnce

        it 'has documents', ->
          expect(context.documents).to.exists

        it 'does not set #signedIn to true', ->
          expect(context.isUserSignedIn()).to.not.be.ok

        after -> spiedResetCurrentDocument.restore()

    describe '#userSignedIn', ->
      spiedDocumentsFetch = null

      before ->
        context = new Context userSignedIn: false
        spiedDocumentsFetch = sinon.spy context.documents, 'fetch'
        context.userSignedIn()

      it 'sets #signedIn to true', ->
        expect(context.isUserSignedIn()).to.be.true

      it 'fetches documents', ->
        expect(spiedDocumentsFetch).to.have.been.calledOnce

      after -> spiedDocumentsFetch.restore()

    describe '#userSignedOut', ->
      spiedDocumentsReset = null
      spiedResetCurrentDocument = null

      before ->
        context =                     new Context userSignedIn: false
        spiedDocumentsReset           = sinon.spy context.documents, 'reset'
        spiedResetCurrentDocument     = sinon.spy context, 'resetCurrentDocument'

        context.userSignedOut()

      it 'sets #signedIn to false', ->
        expect(context.isUserSignedIn()).to.be.false

      it 'resets documents', ->
        expect(spiedDocumentsReset).to.have.been.calledOnce

      it 'resets current document', ->
        expect(spiedDocumentsReset).to.have.been.calledOnce

      after ->
        spiedDocumentsReset.restore()
        spiedResetCurrentDocument.restore()

    describe '#resetCurrentDocument', ->
      before ->
        context             = new Context userSignedIn: false
        context.id          = 1
        context.title       = 'test'
        context.content     = 'A -> B: Method'

        context.resetCurrentDocument()

      it 'resets id', -> expect(context.id).to.be.null

      it 'resets title', -> expect(context.title).to.be.null

      it 'resets content', -> expect(context.content).to.be.null

    describe '#setCurrentDocument', ->

      describe 'success', ->
        stubbedDocumentsFetchOne      = null
        spiedCallback                 = null
        document                      = null
        attributes                    = null

        before ->
          attributes =
            id: 99
            title: 'test doc'
            content: 'A -> B: Method'

          document = toJSON: -> attributes

          context = new Context userSignedIn: false
          stubbedDocumentsFetchOne = sinon.stub(context.documents, 'fetchOne')
            .yieldsTo 'success', document

          spiedCallback = sinon.spy()

          context.setCurrentDocument 1, spiedCallback

        it 'sets current document id', ->
          expect(context.getCurrentDocumentId()).to.equal attributes.id

        it 'sets current document title', ->
          expect(context.getCurrentDocumentTitle()).to.equal attributes.title

        it 'sets current document content', ->
          expect(context.getCurrentDocumentContent())
            .to.equal attributes.content

        it 'invokes the callback', ->
          expect(spiedCallback).to.have.calledWith document

        after -> stubbedDocumentsFetchOne.restore()

      describe 'error', ->
        stubbedDocumentsFetchOne      = null
        spiedResetCurrentDocument     = null
        callbackInvoked               = null

        before ->
          context = new Context userSignedIn: false

          stubbedDocumentsFetchOne = sinon.stub(context.documents, 'fetchOne')
            .yieldsTo 'error'
          spiedResetCurrentDocument = sinon.spy context, 'resetCurrentDocument'
          callbackInvoked = false
          context.setCurrentDocument 1, -> callbackInvoked = true

        it 'resets current document', ->
          expect(spiedResetCurrentDocument).to.have.been.calledOnce

        it 'invokes the callback', -> expect(callbackInvoked).to.be.true

        after ->
          stubbedDocumentsFetchOne.restore()
          spiedResetCurrentDocument.restore()

    describe '#saveCurrentDocument', ->

      describe 'new', ->
        stubbedIsCurrentDocumentNew     = null
        stubbedDocumentsCreate          = null
        spiedCallback                   = null

        before ->
          context = new Context userSignedIn: false
          stubbedIsCurrentDocumentNew = sinon.stub context,
            'isCurrentDocumentNew',
            -> true
          stubbedDocumentsCreate = sinon.stub(context.documents, 'create')
            .yieldsTo 'success', id: 99

          context.setCurrentDocumentTitle 'test doc'
          context.setCurrentDocumentContent 'X -> Y: Call'

          spiedCallback = sinon.spy()
          context.saveCurrentDocument spiedCallback

        it 'creates', ->
          expect(stubbedDocumentsCreate)
          .to.have.been.calledWith { content: 'X -> Y: Call', title: 'test doc' },
            { wait: true, success: sinon.match.func }

        it 'invokes the callback', ->
          expect(spiedCallback).to.have.been.calledOnce

        it 'sets current document id', ->
          expect(context.getCurrentDocumentId()).to.equal 99

        after ->
          stubbedIsCurrentDocumentNew.restore()
          stubbedDocumentsCreate.restore()

      describe 'existing', ->
        content                         = 'A -> B: Method'
        document                        = null
        stubbedIsCurrentDocumentNew     = null
        stubbedDocumentsGet             = null
        stubbedDocumentSave             = null
        spiedCallback                   = null

        before ->
          document =
            save: ->

          context = new Context userSignedIn: false
          stubbedIsCurrentDocumentNew = sinon.stub context,
            'isCurrentDocumentNew',
            -> false

          stubbedDocumentsGet = sinon.stub context.documents,
            'get',
            -> document

          stubbedDocumentSave = sinon.stub(document, 'save')
            .yieldsTo 'success'

          context.setCurrentDocumentContent content

          spiedCallback = sinon.spy()
          context.saveCurrentDocument spiedCallback

        it 'saves', ->
          expect(stubbedDocumentSave).to.have.been.calledWith { content }

        it 'invokes the callback', ->
          expect(spiedCallback).to.have.been.calledOnce

        after ->
          stubbedIsCurrentDocumentNew.restore()
          stubbedDocumentsGet.restore()

    describe '#getNewDocumentTitle', ->

      describe 'title is set', ->
        title = null

        before ->
          context = new Context userSignedIn: false
          context.setCurrentDocumentTitle 'test doc'
          title = context.getNewDocumentTitle()

        it 'returns same title', -> expect(title).to.equal 'test doc'
        
      describe 'title not set', ->
        title = null

        before ->
          context = new Context userSignedIn: false
          context.documents.length = 6
          title = context.getNewDocumentTitle()

        it 'returns incremented title', ->
          expect(title).to.equal 'New document 7'

    after -> Context::documentsType = originalDocumentsType