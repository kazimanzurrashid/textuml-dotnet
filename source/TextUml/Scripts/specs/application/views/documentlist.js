define(function (require) {
    var $, Document, DocumentList, Documents;
    $ = require('jquery');
    DocumentList = require('../../../application/views/documentlist');
    Documents = require('../../../application/models/documents');
    Document = require('../../../application/models/document');
    return describe('views/documentlist', function () {
        var collection, spiedListenTo, stubbedRender, stubbedRenderItem, view;
        collection = null;
        spiedListenTo = null;
        stubbedRender = null;
        stubbedRenderItem = null;
        view = null;
        before(function () {
            fixtures.set('<div id="document-list">' +
                '<div class="btn-toolbar">' +
                  '<a class="btn" data-sort-attribute="title">title</a>' +
                  '<a class="btn" data-sort-order="0">ascending</a>' +
                '</div>' +
                '<div class="list-container">' +
                  '<ul></ul>' +
                '</div>' +
                '<script id="document-item-template" type="text/html">' +
                  '<%= title %>' +
                '</script>' +
                '<script id="document-edit-item-template" type="text/html">' +
                  '<%= title %>' +
                '</script>' +
              '</div>');
            collection = new Documents([
              new Document({
                  id: 1,
                  title: '1st diagram',
                  createdAt: new Date,
                  updatedAt: new Date
              }), new Document({
                  id: 2,
                  title: '2nd diagram',
                  createdAt: new Date,
                  updatedAt: new Date
              }), new Document({
                  id: 3,
                  title: '3rd diagram',
                  createdAt: new Date,
                  updatedAt: new Date
              })
            ]);
            spiedListenTo = sinon.spy(DocumentList.prototype, 'listenTo');
            stubbedRender = sinon.stub(DocumentList.prototype, 'render', function () { });
            stubbedRenderItem = sinon.stub(DocumentList.prototype, 'renderItem', function () { });
            return view = new DocumentList({
                el: $(fixtures.window().document.body).find('#document-list'),
                collection: collection.clone()
            });
        });
        describe('new', function () {
            it('subscribes to collection reset and sort event', function () {
                return expect(spiedListenTo).to.have.been.calledWith(view.collection, 'reset sort', view.render);
            });
            it('subscribes to collection add event', function () {
                return expect(spiedListenTo).to.have.been.calledWith(view.collection, 'add', view.renderItem);
            });
            it('renders collection', function () {
                return expect(stubbedRender).to.have.been.calledOnce;
            });
            return after(function () {
                return stubbedRender.reset();
            });
        });
        describe('#collection event handling', function () {
            describe('reset', function () {
                before(function () {
                    return view.collection.reset();
                });
                it('renders', function () {
                    return expect(stubbedRender).to.have.been.calledOnce;
                });
                return after(function () {
                    return view.collection.reset(collection.toJSON());
                });
            });
            describe('add', function () {
                before(function () {
                    return view.collection.add(new Document({
                        id: 4,
                        title: '4th diagram',
                        createdAt: new Date,
                        updatedAt: new Date
                    }));
                });
                it('renders new model', function () {
                    return expect(stubbedRenderItem).to.have.been.calledOnce;
                });
                return after(function () {
                    return stubbedRenderItem.reset();
                });
            });
            return after(function () {
                return view.collection.reset(collection.toJSON());
            });
        });
        describe('#resetSelection', function () {
            before(function () {
                stubbedRender.restore();
                view.render();
                view.list.children().first().trigger('click');
                return view.resetSelection();
            });
            return it('no longer has any selection', function () {
                expect(view.getSelectedId()).to.be.undefined;
                return expect(view.list.children().first()).to.not.have["class"]('active');
            });
        });
        describe('#render', function () {
            var stubbedRemoveChildren;
            stubbedRemoveChildren = null;
            before(function () {
                stubbedRenderItem.reset();
                stubbedRender.restore();
                stubbedRemoveChildren = sinon.stub(view, 'removeChildren', function () { });
                return view.render();
            });
            it('removes existing items', function () {
                return expect(stubbedRemoveChildren).to.have.been.calledOnce;
            });
            it('renders each model of collection', function () {
                return expect(stubbedRenderItem.callCount).to.equal(view.collection.length);
            });
            return after(function () {
                return stubbedRemoveChildren.restore();
            });
        });
        describe('#onSort', function () {
            var button, oldPageIndex, originalPageIndex, originalSortAttribute, originalSortOrder, stubbedFetch;
            originalPageIndex = null;
            originalSortAttribute = null;
            originalSortOrder = null;
            oldPageIndex = null;
            stubbedFetch = null;
            button = null;
            before(function () {
                originalPageIndex = view.collection.pageIndex;
                originalSortAttribute = view.collection.sortAttribute;
                originalSortOrder = view.collection.sortOrder;
                return stubbedFetch = sinon.stub(view.collection, 'fetch', function () { });
            });
            describe('sort attribute', function () {
                var oldSortAttribute;
                oldSortAttribute = null;
                before(function () {
                    view.collection.pageIndex = 2;
                    return button = view.$('.btn-toolbar .btn').first();
                });
                describe('changed', function () {
                    before(function () {
                        oldPageIndex = view.collection.pageIndex;
                        oldSortAttribute = view.collection.sortAttribute;
                        return button.trigger('click');
                    });
                    it('changes sort attribute', function () {
                        return expect(view.collection.sortAttribute).to.not.equal(oldSortAttribute);
                    });
                    it('resets page index', function () {
                        return expect(view.collection.pageIndex).to.not.equal(oldPageIndex);
                    });
                    it('fetches data', function () {
                        return expect(stubbedFetch).to.have.been.calledOnce;
                    });
                    return after(function () {
                        return stubbedFetch.reset();
                    });
                });
                describe('not changed', function () {
                    before(function () {
                        view.collection.sortAttribute = button.attr('data-sort-attribute');
                        oldPageIndex = view.collection.pageIndex;
                        oldSortAttribute = view.collection.sortAttribute;
                        return button.trigger('click');
                    });
                    it('does not change sort attribute', function () {
                        return expect(view.collection.sortAttribute).to.equal(oldSortAttribute);
                    });
                    it('does not reset page index', function () {
                        return expect(view.collection.pageIndex).to.equal(oldPageIndex);
                    });
                    it('does not fetch data', function () {
                        return expect(stubbedFetch).to.not.have.been.called;
                    });
                    return after(function () {
                        return stubbedFetch.reset();
                    });
                });
                return after(function () {
                    view.collection.pageIndex = oldPageIndex;
                    return view.collection.sortAttribute = oldSortAttribute;
                });
            });
            describe('sort order', function () {
                var oldSortOrder;
                oldSortOrder = null;
                before(function () {
                    view.collection.pageIndex = 2;
                    return button = view.$('.btn-toolbar .btn').last();
                });
                describe('changed', function () {
                    before(function () {
                        oldPageIndex = view.collection.pageIndex;
                        oldSortOrder = view.collection.sortOrder;
                        return button.trigger('click');
                    });
                    it('changes sort order', function () {
                        return expect(view.collection.sortOrder).to.not.equal(oldSortOrder);
                    });
                    it('resets page index', function () {
                        return expect(view.collection.pageIndex).to.not.equal(oldPageIndex);
                    });
                    it('fetches data', function () {
                        return expect(stubbedFetch).to.have.been.calledOnce;
                    });
                    return after(function () {
                        return stubbedFetch.reset();
                    });
                });
                describe('not changed', function () {
                    before(function () {
                        view.collection.sortOrder = parseInt(button.attr('data-sort-order'), 10);
                        oldPageIndex = view.collection.pageIndex;
                        oldSortOrder = view.collection.sortOrder;
                        return button.trigger('click');
                    });
                    it('does not change sort order', function () {
                        return expect(view.collection.sortOrder).to.equal(oldSortOrder);
                    });
                    it('does not reset page index', function () {
                        return expect(view.collection.pageIndex).to.equal(oldPageIndex);
                    });
                    it('does not fetch data', function () {
                        return expect(stubbedFetch).to.not.have.been.called;
                    });
                    return after(function () {
                        return stubbedFetch.reset();
                    });
                });
                return after(function () {
                    view.collection.pageIndex = oldPageIndex;
                    return view.collection.sortOrder = oldSortOrder;
                });
            });
            return after(function () {
                view.collection.pageIndex = originalPageIndex;
                view.collection.sortAttribute = originalSortAttribute;
                view.collection.sortOrder = originalSortOrder;
                return stubbedFetch.restore();
            });
        });
        describe('#onScroll', function () {
            var oldPageIndex, originalPageCount, stubbedFetch, stubbedIsEndOgScrolling;
            stubbedIsEndOgScrolling = null;
            stubbedFetch = null;
            originalPageCount = null;
            oldPageIndex = null;
            before(function () {
                originalPageCount = view.collection.pageCount;
                stubbedIsEndOgScrolling = sinon.stub(view, 'isEndOfScrolling');
                stubbedFetch = sinon.stub(view.collection, 'fetch', function () { });
                return view.collection.pageCount = 5;
            });
            describe('end of scrollbar', function () {
                before(function () {
                    oldPageIndex = view.collection.pageIndex;
                    stubbedIsEndOgScrolling.returns(true);
                    return view.onScroll();
                });
                it('increments #collection #pageIndex', function () {
                    return expect(view.collection.pageIndex).to.be.above(oldPageIndex);
                });
                it('fetches data', function () {
                    return expect(stubbedFetch).to.have.been.calledOnce;
                });
                return after(function () {
                    stubbedIsEndOgScrolling.reset();
                    stubbedFetch.reset();
                    return view.collection.pageIndex = oldPageIndex;
                });
            });
            describe('not end of scrollbar', function () {
                before(function () {
                    oldPageIndex = view.collection.pageIndex;
                    stubbedIsEndOgScrolling.returns(false);
                    return view.onScroll();
                });
                it('does not change #collection #pageIndex', function () {
                    return expect(view.collection.pageIndex).to.be.equal(oldPageIndex);
                });
                it('does not fetch data', function () {
                    return expect(stubbedFetch).to.not.have.been.called;
                });
                return after(function () {
                    stubbedIsEndOgScrolling.reset();
                    stubbedFetch.reset();
                    return view.collection.pageIndex = oldPageIndex;
                });
            });
            return after(function () {
                stubbedIsEndOgScrolling.restore();
                stubbedFetch.restore();
                return view.collection.pageCount = originalPageCount;
            });
        });
        describe('#onNavigate', function () {
            before(function () {
                stubbedRender.restore();
                stubbedRenderItem.restore();
                return view.render();
            });
            describe('down arrow', function () {
                before(function () {
                    var e;
                    e = $.Event('keydown');
                    e.which = 40;
                    view.list.children().first().addClass('active');
                    return view.list.trigger(e);
                });
                it('deselects the current item', function () {
                    return expect(view.list.children().first()).to.not.have["class"]('active');
                });
                it('selects the next item', function () {
                    return expect(view.list.children().first().next()).to.have["class"]('active');
                });
                return after(function () {
                    return view.list.children().first().next().removeClass('active');
                });
            });
            describe('up arrow', function () {
                before(function () {
                    var e;
                    e = $.Event('keydown');
                    e.which = 38;
                    view.list.children().first().next().addClass('active');
                    return view.list.trigger(e);
                });
                it('deselects the current item', function () {
                    return expect(view.list.children().first().next()).to.not.have["class"]('active');
                });
                it('selects the previous item', function () {
                    return expect(view.list.children().first()).to.have["class"]('active');
                });
                return after(function () {
                    return view.list.children().first().removeClass('active');
                });
            });
            return describe('spacebar', function () {
                var openedTriggered;
                openedTriggered = null;
                before(function (done) {
                    var e;
                    openedTriggered = null;
                    view.on('opened', function () {
                        openedTriggered = true;
                        return done();
                    });
                    e = $.Event('keydown');
                    e.which = 32;
                    view.list.children().first().addClass('active');
                    return view.list.trigger(e);
                });
                it('opens the selected the item', function () {
                    return expect(openedTriggered).to.be["true"];
                });
                return after(function () {
                    return view.list.children().first().removeClass('active');
                });
            });
        });
        return after(function () {
            view.undelegateEvents();
            view.stopListening();
            spiedListenTo.restore();
            stubbedRender.restore();
            stubbedRenderItem.restore();
            return fixtures.cleanUp();
        });
    });
});