define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Validation  = require './validation'

  class Document extends Backbone.Model
    urlRoot: '/api/documents'

    defaults: ->
      title     : null
      content   : null
      createdAt : null
      updatedAt : null

    validate: (attributes) ->
      errors = {}
      unless attributes.title
        Validation.addError errors, 'title', 'Title is required.'

      if _(errors).isEmpty() then undefined else errors