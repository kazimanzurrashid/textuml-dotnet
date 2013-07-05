define (require) ->
  $               = require 'jquery'
  DocumentList    = require '../../../application/views/documentlist'
  Documents       = require '../../../application/models/documents'
  Document        = require '../../../application/models/document'

  describe 'views/documentlist', ->
    collection            = null
    spiedListenTo         = null
    stubbedRender         = null
    stubbedRenderItem     = null
    view                  = null

    before ->
      fixtures.set('<div id="document-list">' +
          '<div class="btn-toolbar">' +
            '<a class="btn" data-sort-attribute="title">title</a>' +
            '<a class="btn" data-sort-order="0">ascending</a>' +
          '</div>' +
          '<div class="list-container">' +
            '<ul></ul>'+
          '</div>' +
          '<script id="document-item-template" type="text/html">' +
            '<%= title %>'+
          '</script>' +
          '<script id="document-edit-item-template" type="text/html">' +
            '<%= title %>' +
          '</script>' +
        '</div>')

      collection = new Documents [
        new Document
          id          : 1
          title       : '1st diagram'
          createdAt   : new Date
          updatedAt   : new Date
        new Document
          id          : 2
          title       : '2nd diagram'
          createdAt   : new Date
          updatedAt   : new Date
        new Document
          id          : 3
          title       : '3rd diagram'
          createdAt   : new Date
          updatedAt   : new Date
      ]

      spiedListenTo         = sinon.spy DocumentList.prototype, 'listenTo'
      stubbedRender         = sinon.stub DocumentList.prototype, 'render', ->
      stubbedRenderItem     = sinon.stub DocumentList.prototype, 'renderItem', ->

      view = new DocumentList
        el          : $(fixtures.window().document.body).find '#document-list'
        collection  : collection.clone()

    describe 'new', ->
      it 'subscribes to collection reset and sort event', ->
        expect(spiedListenTo).to.have.been.calledWith view.collection, 'reset sort', view.render

      it 'subscribes to collection add event', ->
        expect(spiedListenTo).to.have.been.calledWith view.collection, 'add', view.renderItem

      it 'renders collection', -> expect(stubbedRender).to.have.been.calledOnce

      after -> stubbedRender.reset()

    describe '#collection event handling', ->

      describe 'reset', ->

        before -> view.collection.reset()

        it 'renders', -> expect(stubbedRender).to.have.been.calledOnce

        after -> view.collection.reset collection.toJSON()

      describe 'add', ->
        before ->
          view.collection.add new Document
            id          : 4
            title       : '4th diagram'
            createdAt   : new Date
            updatedAt   : new Date

        it 'renders new model', -> expect(stubbedRenderItem).to.have.been.calledOnce

        after -> stubbedRenderItem.reset()

      after -> view.collection.reset collection.toJSON()

    describe '#resetSelection', ->
      before ->
        stubbedRender.restore()
        view.render()
        view.list.children().first().trigger 'click'
        view.resetSelection()

      it 'no longer has any selection', ->
        expect(view.getSelectedId()).to.be.undefined
        expect(view.list.children().first()).to.not.have.class 'active'

    describe '#render', ->
      stubbedRemoveChildren = null

      before ->
        stubbedRenderItem.reset()
        stubbedRender.restore()
        stubbedRemoveChildren = sinon.stub view, 'removeChildren', ->
        view.render()
        
      it 'removes existing items', ->
        expect(stubbedRemoveChildren).to.have.been.calledOnce

      it 'renders each model of collection', ->
        expect(stubbedRenderItem.callCount).to.equal view.collection.length

      after -> stubbedRemoveChildren.restore()

    describe '#onSort', ->
      originalPageIndex         = null
      originalSortAttribute     = null
      originalSortOrder         = null

      oldPageIndex              = null
      stubbedFetch              = null
      button                    = null

      before ->
        originalPageIndex         = view.collection.pageIndex
        originalSortAttribute     = view.collection.sortAttribute
        originalSortOrder         = view.collection.sortOrder

        stubbedFetch = sinon.stub view.collection, 'fetch', ->

      describe 'sort attribute', ->
        oldSortAttribute  = null

        before ->
          view.collection.pageIndex = 2
          button                    = view.$('.btn-toolbar .btn').first()

        describe 'changed', ->
          before ->
            oldPageIndex              = view.collection.pageIndex
            oldSortAttribute          = view.collection.sortAttribute

            button.trigger 'click'

          it 'changes sort attribute', ->
            expect(view.collection.sortAttribute).to.not.equal oldSortAttribute

          it 'resets page index', ->
            expect(view.collection.pageIndex).to.not.equal oldPageIndex

          it 'fetches data', -> expect(stubbedFetch).to.have.been.calledOnce

          after -> stubbedFetch.reset()

        describe 'not changed', ->
          before ->
            view.collection.sortAttribute = button.attr 'data-sort-attribute'
            oldPageIndex                  = view.collection.pageIndex
            oldSortAttribute              = view.collection.sortAttribute

            button.trigger 'click'

          it 'does not change sort attribute', ->
            expect(view.collection.sortAttribute).to.equal oldSortAttribute

          it 'does not reset page index', ->
            expect(view.collection.pageIndex).to.equal oldPageIndex

          it 'does not fetch data', ->
            expect(stubbedFetch).to.not.have.been.called
        
          after -> stubbedFetch.reset()

        after ->
          view.collection.pageIndex       = oldPageIndex
          view.collection.sortAttribute   = oldSortAttribute

      describe 'sort order', ->
        oldSortOrder  = null

        before ->
          view.collection.pageIndex = 2
          button                    = view.$('.btn-toolbar .btn').last()

        describe 'changed', ->
          before ->
            oldPageIndex          = view.collection.pageIndex
            oldSortOrder          = view.collection.sortOrder

            button.trigger 'click'

          it 'changes sort order', ->
            expect(view.collection.sortOrder).to.not.equal oldSortOrder

          it 'resets page index', ->
            expect(view.collection.pageIndex).to.not.equal oldPageIndex

          it 'fetches data', -> expect(stubbedFetch).to.have.been.calledOnce

          after -> stubbedFetch.reset()

        describe 'not changed', ->
          before ->
            view.collection.sortOrder = parseInt button.attr('data-sort-order'), 10
            oldPageIndex              = view.collection.pageIndex
            oldSortOrder              = view.collection.sortOrder

            button.trigger 'click'

          it 'does not change sort order', ->
            expect(view.collection.sortOrder).to.equal oldSortOrder

          it 'does not reset page index', ->
            expect(view.collection.pageIndex).to.equal oldPageIndex

          it 'does not fetch data', ->
            expect(stubbedFetch).to.not.have.been.called
        
          after -> stubbedFetch.reset()

        after ->
          view.collection.pageIndex = oldPageIndex
          view.collection.sortOrder = oldSortOrder

      after ->
        view.collection.pageIndex       = originalPageIndex
        view.collection.sortAttribute   = originalSortAttribute
        view.collection.sortOrder       = originalSortOrder
        stubbedFetch.restore()

     describe '#onScroll', ->
      stubbedIsEndOgScrolling     = null
      stubbedFetch                = null
      originalPageCount           = null
      oldPageIndex                = null

      before ->
        originalPageCount           = view.collection.pageCount
        stubbedIsEndOgScrolling     = sinon.stub view, 'isEndOfScrolling'
        stubbedFetch                = sinon.stub view.collection, 'fetch', ->
        view.collection.pageCount = 5

      describe 'end of scrollbar', ->
        before ->
          oldPageIndex = view.collection.pageIndex
          stubbedIsEndOgScrolling.returns true
          view.onScroll()

        it 'increments #collection #pageIndex', ->
          expect(view.collection.pageIndex).to.be.above oldPageIndex

        it 'fetches data', -> expect(stubbedFetch).to.have.been.calledOnce

        after ->
          stubbedIsEndOgScrolling.reset()
          stubbedFetch.reset()
          view.collection.pageIndex = oldPageIndex

      describe 'not end of scrollbar', ->
        before ->
          oldPageIndex = view.collection.pageIndex
          stubbedIsEndOgScrolling.returns false
          view.onScroll()

        it 'does not change #collection #pageIndex', ->
          expect(view.collection.pageIndex).to.be.equal oldPageIndex

        it 'does not fetch data', ->
          expect(stubbedFetch).to.not.have.been.called

        after ->
          stubbedIsEndOgScrolling.reset()
          stubbedFetch.reset()
          view.collection.pageIndex = oldPageIndex

      after ->
        stubbedIsEndOgScrolling.restore()
        stubbedFetch.restore()
        view.collection.pageCount = originalPageCount

    describe '#onNavigate', ->
      before ->
        stubbedRender.restore()
        stubbedRenderItem.restore()
        view.render()

      describe 'down arrow', ->
        before ->
          e = $.Event 'keydown'
          e.which = 40
          view.list.children().first().addClass 'active'

          view.list.trigger e

        it 'deselects the current item', ->
          expect(view.list.children().first()).to.not.have.class 'active'
          
        it 'selects the next item', ->
          expect(view.list.children().first().next()).to.have.class 'active'

        after -> view.list.children().first().next().removeClass 'active'

      describe 'up arrow', ->
        before ->
          e = $.Event 'keydown'
          e.which = 38
          view.list.children().first().next().addClass 'active'

          view.list.trigger e

        it 'deselects the current item', ->
          expect(view.list.children().first().next()).to.not.have.class 'active'
          
        it 'selects the previous item', ->
          expect(view.list.children().first()).to.have.class 'active'

        after -> view.list.children().first().removeClass 'active'

      describe 'spacebar', ->
        openedTriggered = null

        before (done) ->
          openedTriggered = null
          view.on 'opened', ->
            openedTriggered = true
            done()
          e = $.Event 'keydown'
          e.which = 32
          view.list.children().first().addClass 'active'
          view.list.trigger e

        it 'opens the selected the item', -> expect(openedTriggered).to.be.true

        after -> view.list.children().first().removeClass 'active'

    after ->
      view.undelegateEvents()
      view.stopListening()
      spiedListenTo.restore()
      stubbedRender.restore()
      stubbedRenderItem.restore()
      fixtures.cleanUp()