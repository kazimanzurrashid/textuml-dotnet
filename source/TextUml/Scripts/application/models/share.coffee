define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Validation  = require './validation'

  class Share extends Backbone.Model
    defaults: ->
      email         : null
      canEdit       : false

    validate: (attributes) ->
      errors = {}

      if attributes.email
        unless Validation.isValidEmailFormat attributes.email
          Validation.addError errors, 'email', 'Invalid email format.'
      else
        Validation.addError errors, 'email', 'Email is required.'

      if _(errors).isEmpty() then undefined else errors