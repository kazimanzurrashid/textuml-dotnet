define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  validation  = require './validation'

  class Document extends Backbone.Model
    urlRoot: -> '/api/documents'

    defaults: ->
      title         : null
      content       : null
      owned         : null
      shared        : null
      editable      : null
      createdAt     : null
      updatedAt     : null

    validate: (attributes) ->
      errors = {}
      unless attributes.title
        validation.addError errors, 'title', 'Title is required.'

      if _(errors).isEmpty() then undefined else errors