define (require) ->
  $           = require 'jquery'
  _           = require 'underscore'
  SortOrder   = require './sortorder'
  Document    = require './document'

  class Documents extends Backbone.Collection
    defaultSortAttribute  : 'updatedAt'
    defaultSortOrder      : SortOrder.descending
    countAttribute        : 'count'
    resultAttribute       : 'data'
    defaultPageSize       : 25
    filter                : null
    url                   : '/api/documents'
    model                 : Document

    constructor: ->
      super
      @resetSorting()
      @resetPaging()

    parse: (resp) ->
      @setCounts resp[@countAttribute]
      resp[@resultAttribute]

    fetch: (options = {}) ->
      query = top: @pageSize
      query.skip = @pageSize * @pageIndex if @pageIndex

      if @sortAttribute
        orderBy = @sortAttribute
        if @sortOrder is SortOrder.ascending
          orderBy += ' asc'
        else if @sortOrder is SortOrder.descending
          orderBy += ' desc'
        query.orderBy = orderBy

      query.filter = @filter if @filter
      options.url = (_(@).result 'url') + '?' + $.param query
      super options

    fetchOne: (id, options) ->
      options = _(options).defaults
        success: ->
        error: ->

      document = @get id

      if document
        _(-> options.success document).defer()
      else
        document = new Document
        document.id = id
        success = options.success
        options.success = =>
          @add document
          success document
        document.fetch options

    setCounts: (count) ->
      @totalCount = count
      @pageCount = Math.ceil count / @pageSize
      @

    resetSorting: ->
      @sortAttribute = @defaultSortAttribute
      @sortOrder = @defaultSortOrder

    resetPaging: ->
      @pageSize = @defaultPageSize
      @pageIndex = 0
      @pageCount = 0
      @totalCount = 0