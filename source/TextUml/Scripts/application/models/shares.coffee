define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Share       = require './share'

  class Shares extends Backbone.Collection
    model: Share

    url: -> "/api/documents/#{@documentId}/shares"

    update: (options) -> Backbone.sync 'update', @, options

    @collections: {}

    @get: (documentId, callback) ->
      collection = Shares.collections[documentId]

      return _(-> callback collection).defer() if collection?.length

      collection = new Shares
      Shares.set documentId, collection
      collection.fetch
        success: -> callback collection

    @set: (documentId, collection) ->
      collection.documentId = documentId
      Shares.collections[documentId] = collection
      
    @remove: (documentId) ->
      delete Shares.collections[documentId]

    @reset: -> Shares.collections = {}