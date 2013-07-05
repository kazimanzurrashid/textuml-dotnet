
define(function(require) {
  var Context;
  Context = require('../../application/context');
  return describe('context', function() {
    var context, documentsType, originalDocumentsType;
    originalDocumentsType = null;
    documentsType = null;
    context = null;
    before(function() {
      originalDocumentsType = Context.prototype.documentsType;
      documentsType = {
        reset: function() {},
        setCounts: function() {},
        fetch: function() {},
        fetchOne: function() {},
        get: function() {},
        create: function() {},
        length: 0
      };
      return Context.prototype.documentsType = sinon.stub().returns(documentsType);
    });
    describe('new', function() {
      describe('authenticated user', function() {
        var spiedReset, spiedResetCurrentDocument, spiedSetCounts;
        spiedResetCurrentDocument = null;
        spiedReset = null;
        spiedSetCounts = null;
        before(function() {
          spiedResetCurrentDocument = sinon.spy(Context.prototype, 'resetCurrentDocument');
          spiedReset = sinon.spy(documentsType, 'reset');
          spiedSetCounts = sinon.spy(documentsType, 'setCounts');
          return context = new Context({
            userSignedIn: true,
            documents: {
              data: [],
              count: 0
            }
          });
        });
        it('resets current document', function() {
          return expect(spiedResetCurrentDocument).to.have.been.calledOnce;
        });
        it('sets documents', function() {
          return expect(spiedReset).to.have.been.calledWith([]);
        });
        it('sets counts', function() {
          return expect(spiedSetCounts).to.have.been.calledWith(0);
        });
        it('sets #signedIn to true', function() {
          return expect(context.isUserSignedIn()).to.be["true"];
        });
        return after(function() {
          spiedResetCurrentDocument.restore();
          spiedReset.restore();
          return spiedSetCounts.restore();
        });
      });
      return describe('unauthenticated user', function() {
        var spiedResetCurrentDocument;
        spiedResetCurrentDocument = null;
        before(function() {
          spiedResetCurrentDocument = sinon.spy(Context.prototype, 'resetCurrentDocument');
          return context = new Context({
            userSignedIn: false
          });
        });
        it('resets current document', function() {
          return expect(spiedResetCurrentDocument).to.have.been.calledOnce;
        });
        it('has documents', function() {
          return expect(context.documents).to.exists;
        });
        it('does not set #signedIn to true', function() {
          return expect(context.isUserSignedIn()).to.not.be.ok;
        });
        return after(function() {
          return spiedResetCurrentDocument.restore();
        });
      });
    });
    describe('#userSignedIn', function() {
      var spiedDocumentsFetch;
      spiedDocumentsFetch = null;
      before(function() {
        context = new Context({
          userSignedIn: false
        });
        spiedDocumentsFetch = sinon.spy(context.documents, 'fetch');
        return context.userSignedIn();
      });
      it('sets #signedIn to true', function() {
        return expect(context.isUserSignedIn()).to.be["true"];
      });
      it('fetches documents', function() {
        return expect(spiedDocumentsFetch).to.have.been.calledOnce;
      });
      return after(function() {
        return spiedDocumentsFetch.restore();
      });
    });
    describe('#userSignedOut', function() {
      var spiedDocumentsReset, spiedResetCurrentDocument;
      spiedDocumentsReset = null;
      spiedResetCurrentDocument = null;
      before(function() {
        context = new Context({
          userSignedIn: false
        });
        spiedDocumentsReset = sinon.spy(context.documents, 'reset');
        spiedResetCurrentDocument = sinon.spy(context, 'resetCurrentDocument');
        return context.userSignedOut();
      });
      it('sets #signedIn to false', function() {
        return expect(context.isUserSignedIn()).to.be["false"];
      });
      it('resets documents', function() {
        return expect(spiedDocumentsReset).to.have.been.calledOnce;
      });
      it('resets current document', function() {
        return expect(spiedDocumentsReset).to.have.been.calledOnce;
      });
      return after(function() {
        spiedDocumentsReset.restore();
        return spiedResetCurrentDocument.restore();
      });
    });
    describe('#resetCurrentDocument', function() {
      before(function() {
        context = new Context({
          userSignedIn: false
        });
        context.id = 1;
        context.title = 'test';
        context.content = 'A -> B: Method';
        return context.resetCurrentDocument();
      });
      it('resets id', function() {
        return expect(context.id).to.be["null"];
      });
      it('resets title', function() {
        return expect(context.title).to.be["null"];
      });
      return it('resets content', function() {
        return expect(context.content).to.be["null"];
      });
    });
    describe('#setCurrentDocument', function() {
      describe('success', function() {
        var attributes, document, spiedCallback, stubbedDocumentsFetchOne;
        stubbedDocumentsFetchOne = null;
        spiedCallback = null;
        document = null;
        attributes = null;
        before(function() {
          attributes = {
            id: 99,
            title: 'test doc',
            content: 'A -> B: Method'
          };
          document = {
            toJSON: function() {
              return attributes;
            }
          };
          context = new Context({
            userSignedIn: false
          });
          stubbedDocumentsFetchOne = sinon.stub(context.documents, 'fetchOne').yieldsTo('success', document);
          spiedCallback = sinon.spy();
          return context.setCurrentDocument(1, spiedCallback);
        });
        it('sets current document id', function() {
          return expect(context.getCurrentDocumentId()).to.equal(attributes.id);
        });
        it('sets current document title', function() {
          return expect(context.getCurrentDocumentTitle()).to.equal(attributes.title);
        });
        it('sets current document content', function() {
          return expect(context.getCurrentDocumentContent()).to.equal(attributes.content);
        });
        it('invokes the callback', function() {
          return expect(spiedCallback).to.have.calledWith(document);
        });
        return after(function() {
          return stubbedDocumentsFetchOne.restore();
        });
      });
      return describe('error', function() {
        var callbackInvoked, spiedResetCurrentDocument, stubbedDocumentsFetchOne;
        stubbedDocumentsFetchOne = null;
        spiedResetCurrentDocument = null;
        callbackInvoked = null;
        before(function() {
          context = new Context({
            userSignedIn: false
          });
          stubbedDocumentsFetchOne = sinon.stub(context.documents, 'fetchOne').yieldsTo('error');
          spiedResetCurrentDocument = sinon.spy(context, 'resetCurrentDocument');
          callbackInvoked = false;
          return context.setCurrentDocument(1, function() {
            return callbackInvoked = true;
          });
        });
        it('resets current document', function() {
          return expect(spiedResetCurrentDocument).to.have.been.calledOnce;
        });
        it('invokes the callback', function() {
          return expect(callbackInvoked).to.be["true"];
        });
        return after(function() {
          stubbedDocumentsFetchOne.restore();
          return spiedResetCurrentDocument.restore();
        });
      });
    });
    describe('#isCurrentDocumentDirty', function() {
      describe('new', function() {
        var stubbedIsCurrentDocumentNew;
        stubbedIsCurrentDocumentNew = null;
        before(function() {
          context = new Context({
            userSignedIn: false
          });
          return stubbedIsCurrentDocumentNew = sinon.stub(context, 'isCurrentDocumentNew', function() {
            return true;
          });
        });
        describe('with content', function() {
          before(function() {
            return context.setCurrentDocumentContent('A -> B: Method');
          });
          return it('returns true', function() {
            return expect(context.isCurrentDocumentDirty()).to.be.ok;
          });
        });
        describe('no content', function() {
          before(function() {
            return context.setCurrentDocumentContent('');
          });
          return it('returns false', function() {
            return expect(context.isCurrentDocumentDirty()).to.not.be.ok;
          });
        });
        return after(function() {
          return stubbedIsCurrentDocumentNew.restore();
        });
      });
      return describe('existing', function() {
        var document, stubbedDocumentsGet, stubbedIsCurrentDocumentNew;
        stubbedIsCurrentDocumentNew = null;
        stubbedDocumentsGet = null;
        document = null;
        before(function() {
          document = {
            get: function() {}
          };
          context = new Context({
            userSignedIn: false
          });
          stubbedIsCurrentDocumentNew = sinon.stub(context, 'isCurrentDocumentNew', function() {
            return false;
          });
          stubbedDocumentsGet = sinon.stub(context.documents, 'get', function() {
            return document;
          });
          return context.setCurrentDocumentContent('A -> B: Method');
        });
        describe('same content', function() {
          var stubbedDocumentGet;
          stubbedDocumentGet = null;
          before(function() {
            return stubbedDocumentGet = sinon.stub(document, 'get', function() {
              return context.getCurrentDocumentContent();
            });
          });
          it('returns false', function() {
            return expect(context.isCurrentDocumentDirty()).to.not.be.ok;
          });
          return after(function() {
            return stubbedDocumentGet.restore();
          });
        });
        describe('different content', function() {
          var stubbedDocumentGet;
          stubbedDocumentGet = null;
          before(function() {
            return stubbedDocumentGet = sinon.stub(document, 'get', function() {
              return 'B -> A: Method returns';
            });
          });
          it('returns true', function() {
            return expect(context.isCurrentDocumentDirty()).to.be.ok;
          });
          return after(function() {
            return stubbedDocumentGet.restore();
          });
        });
        return after(function() {
          stubbedIsCurrentDocumentNew.restore();
          return stubbedDocumentsGet.restore();
        });
      });
    });
    describe('#saveCurrentDocument', function() {
      describe('new', function() {
        var spiedCallback, stubbedDocumentsCreate, stubbedIsCurrentDocumentNew;
        stubbedIsCurrentDocumentNew = null;
        stubbedDocumentsCreate = null;
        spiedCallback = null;
        before(function() {
          context = new Context({
            userSignedIn: false
          });
          stubbedIsCurrentDocumentNew = sinon.stub(context, 'isCurrentDocumentNew', function() {
            return true;
          });
          stubbedDocumentsCreate = sinon.stub(context.documents, 'create').yieldsTo('success', {
            id: 99
          });
          context.setCurrentDocumentTitle('test doc');
          context.setCurrentDocumentContent('X -> Y: Call');
          spiedCallback = sinon.spy();
          return context.saveCurrentDocument(spiedCallback);
        });
        it('creates', function() {
          return expect(stubbedDocumentsCreate).to.have.been.calledWith({
            content: 'X -> Y: Call',
            title: 'test doc'
          }, {
            wait: true,
            success: sinon.match.func
          });
        });
        it('invokes the callback', function() {
          return expect(spiedCallback).to.have.been.calledOnce;
        });
        it('sets current document id', function() {
          return expect(context.getCurrentDocumentId()).to.equal(99);
        });
        return after(function() {
          stubbedIsCurrentDocumentNew.restore();
          return stubbedDocumentsCreate.restore();
        });
      });
      return describe('existing', function() {
        var content, document, spiedCallback, stubbedDocumentSave, stubbedDocumentsGet, stubbedIsCurrentDocumentNew;
        content = 'A -> B: Method';
        document = null;
        stubbedIsCurrentDocumentNew = null;
        stubbedDocumentsGet = null;
        stubbedDocumentSave = null;
        spiedCallback = null;
        before(function() {
          document = {
            save: function() {}
          };
          context = new Context({
            userSignedIn: false
          });
          stubbedIsCurrentDocumentNew = sinon.stub(context, 'isCurrentDocumentNew', function() {
            return false;
          });
          stubbedDocumentsGet = sinon.stub(context.documents, 'get', function() {
            return document;
          });
          stubbedDocumentSave = sinon.stub(document, 'save').yieldsTo('success');
          context.setCurrentDocumentContent(content);
          spiedCallback = sinon.spy();
          return context.saveCurrentDocument(spiedCallback);
        });
        it('saves', function() {
          return expect(stubbedDocumentSave).to.have.been.calledWith({
            content: content
          });
        });
        it('invokes the callback', function() {
          return expect(spiedCallback).to.have.been.calledOnce;
        });
        return after(function() {
          stubbedIsCurrentDocumentNew.restore();
          return stubbedDocumentsGet.restore();
        });
      });
    });
    describe('#getNewDocumentTitle', function() {
      describe('title is set', function() {
        var title;
        title = null;
        before(function() {
          context = new Context({
            userSignedIn: false
          });
          context.setCurrentDocumentTitle('test doc');
          return title = context.getNewDocumentTitle();
        });
        return it('returns same title', function() {
          return expect(title).to.equal('test doc');
        });
      });
      return describe('title not set', function() {
        var title;
        title = null;
        before(function() {
          context = new Context({
            userSignedIn: false
          });
          context.documents.length = 6;
          return title = context.getNewDocumentTitle();
        });
        return it('returns incremented title', function() {
          return expect(title).to.equal('New document 7');
        });
      });
    });
    return after(function() {
      return Context.prototype.documentsType = originalDocumentsType;
    });
  });
});
