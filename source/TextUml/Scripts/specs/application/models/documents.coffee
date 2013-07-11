define (require) ->
  Backbone    = require 'backbone'
  Document    = require '../../../application/models/document'
  SortOrder  = require '../../../application/models/sortorder'
  Documents   = require '../../../application/models/documents'

  describe 'models/documents', ->
    documents = null

    beforeEach -> documents = new Documents

    describe '#defaultSortAttribute', ->
      it 'is set', -> expect(documents.defaultSortAttribute).to.exist

    describe '#defaultSortOrder', ->
      it 'is set', -> expect(documents.defaultSortOrder).to.exist

    describe '#countAttribute', ->
      it 'is set', -> expect(documents.countAttribute).to.exist

    describe '#resultAttribute', ->
      it 'is set', -> expect(documents.resultAttribute).to.exist

    describe '#defaultPageSize', ->
      it 'is set', -> expect(documents.defaultPageSize).to.exist

    describe '#url', ->
      it 'is set', -> expect(documents.url).to.exist

    describe '#model', ->
      it 'is Document', -> expect(documents.model).to.deep.equal Document

    describe '#resetSorting', ->
      beforeEach ->
        documents.defaultSortAttribute  = 'createdAt'
        documents.defaultSortOrder      = SortOrder.descending
        documents.sortAttribute         = 'title'
        documents.sortOrder             = SortOrder.ascending

        documents.resetSorting()

      it 'resets #sortAttribute to default', ->
        expect(documents.sortAttribute).to.equal documents.defaultSortAttribute

      it 'resets #sortOrder to default', ->
        expect(documents.sortOrder).to.equal documents.defaultSortOrder

    describe '#resetPaging', ->
      beforeEach ->
        documents.defaultPageSize     = 10 
        documents.pageSize            = 25
        documents.pageIndex           = 1
        documents.pageCount           = 4
        documents.totalCount          = 100

        documents.resetPaging()

      it 'resets #pageSize to default', ->
        expect(documents.pageSize).to.equal documents.defaultPageSize

      it 'resets #pageIndex to default', ->
        expect(documents.pageIndex).to.equal 0

      it 'resets #pageCount to default', ->
        expect(documents.pageCount).to.equal 0

      it 'resets #totalCount to default', ->
        expect(documents.totalCount).to.equal 0

    describe '#parse', ->
      input   = null
      output  = null

      beforeEach ->
        documents.countAttribute    = 'count'
        documents.resultAttribute   = 'data'
        documents.pageSize          = 25

        input = count: 56, data: []
        output = documents.parse input

      it 'returns data', -> expect(output).to.equal input.data

      it 'sets #totalCount', -> expect(documents.totalCount).to.equal 56
        
      it 'sets #pageCount', -> expect(documents.pageCount).to.equal 3

    describe '#url', ->
      url = null

      beforeEach ->
          documents.pageIndex         = 3
          documents.pageSize          = 10
          documents.sortAttribute     = 'title'
          documents.sortOrder         = SortOrder.descending
          documents.filter            = 'test'

          url = documents.url()

      it 'has top in url', ->
          expect(url).to.contain 'top=10'

      it 'has skip in url', ->
          expect(url).to.contain 'skip=30'

      it 'has orderBy in url', ->
          expect(url).to.contain 'orderBy=title+desc'

      it 'has filter in url', ->
          expect(url).to.contain 'filter=test'