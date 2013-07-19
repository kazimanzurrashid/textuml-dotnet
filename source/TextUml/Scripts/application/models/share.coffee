define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  validation  = require './validation'

  class Share extends Backbone.Model
    defaults: ->
      email         : null
      canEdit       : false

    validate: (attributes) ->
      errors = {}

      if attributes.email
        unless validation.isValidEmailFormat attributes.email
          validation.addError errors, 'email', 'Invalid email format.'
      else
        validation.addError errors, 'email', 'Email is required.'

      if _(errors).isEmpty() then undefined else errors