define(function(require) {
  var Backbone, Document, Documents, SortOrder;

  Backbone = require('backbone');
  Document = require('../../../application/models/document');
  SortOrder = require('../../../application/models/sortorder');
  Documents = require('../../../application/models/documents');
  return describe('models/documents', function() {
    var documents;

    documents = null;
    beforeEach(function() {
      return documents = new Documents;
    });
    describe('#defaultSortAttribute', function() {
      return it('is set', function() {
        return expect(documents.defaultSortAttribute).to.exist;
      });
    });
    describe('#defaultSortOrder', function() {
      return it('is set', function() {
        return expect(documents.defaultSortOrder).to.exist;
      });
    });
    describe('#countAttribute', function() {
      return it('is set', function() {
        return expect(documents.countAttribute).to.exist;
      });
    });
    describe('#resultAttribute', function() {
      return it('is set', function() {
        return expect(documents.resultAttribute).to.exist;
      });
    });
    describe('#defaultPageSize', function() {
      return it('is set', function() {
        return expect(documents.defaultPageSize).to.exist;
      });
    });
    describe('#url', function() {
      return it('is set', function() {
        return expect(documents.url).to.exist;
      });
    });
    describe('#model', function() {
      return it('is Document', function() {
        return expect(documents.model).to.deep.equal(Document);
      });
    });
    describe('#resetSorting', function() {
      beforeEach(function() {
        documents.defaultSortAttribute = 'createdAt';
        documents.defaultSortOrder = SortOrder.descending;
        documents.sortAttribute = 'title';
        documents.sortOrder = SortOrder.ascending;
        return documents.resetSorting();
      });
      it('resets #sortAttribute to default', function() {
        return expect(documents.sortAttribute).to.equal(documents.defaultSortAttribute);
      });
      return it('resets #sortOrder to default', function() {
        return expect(documents.sortOrder).to.equal(documents.defaultSortOrder);
      });
    });
    describe('#resetPaging', function() {
      beforeEach(function() {
        documents.defaultPageSize = 10;
        documents.pageSize = 25;
        documents.pageIndex = 1;
        documents.pageCount = 4;
        documents.totalCount = 100;
        return documents.resetPaging();
      });
      it('resets #pageSize to default', function() {
        return expect(documents.pageSize).to.equal(documents.defaultPageSize);
      });
      it('resets #pageIndex to default', function() {
        return expect(documents.pageIndex).to.equal(0);
      });
      it('resets #pageCount to default', function() {
        return expect(documents.pageCount).to.equal(0);
      });
      return it('resets #totalCount to default', function() {
        return expect(documents.totalCount).to.equal(0);
      });
    });
    describe('#parse', function() {
      var input, output;

      input = null;
      output = null;
      beforeEach(function() {
        documents.countAttribute = 'count';
        documents.resultAttribute = 'data';
        documents.pageSize = 25;
        input = {
          count: 56,
          data: []
        };
        return output = documents.parse(input);
      });
      it('returns data', function() {
        return expect(output).to.equal(input.data);
      });
      it('sets #totalCount', function() {
        return expect(documents.totalCount).to.equal(56);
      });
      return it('sets #pageCount', function() {
        return expect(documents.pageCount).to.equal(3);
      });
    });
    return describe('#fetch', function() {
      var options, stubbedFetch;

      stubbedFetch = null;
      options = null;
      before(function() {
        return stubbedFetch = sinon.stub(Backbone.Collection.prototype, 'fetch', function() {});
      });
      beforeEach(function() {
        documents.pageIndex = 3;
        documents.pageSize = 10;
        documents.sortAttribute = 'title';
        documents.sortOrder = SortOrder.descending;
        documents.filter = 'test';
        documents.url = '/documents';
        options = {
          url: ''
        };
        return documents.fetch(options);
      });
      it('has top in url', function() {
        return expect(options.url).to.contain('top=10');
      });
      it('has skip in url', function() {
        return expect(options.url).to.contain('skip=30');
      });
      it('has orderBy in url', function() {
        return expect(options.url).to.contain('orderBy=title+desc');
      });
      it('has filter in url', function() {
        return expect(options.url).to.contain('filter=test');
      });
      return after(function() {
        return stubbedFetch.restore();
      });
    });
  });
});
