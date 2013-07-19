define (require) ->
  Backbone    = require 'backbone'
  Share       = require './share'

  class Shares extends Backbone.Collection
    model: Share

    url: -> "/api/documents/#{@documentId}/shares"

    update: (options) -> Backbone.sync 'update', @, options