define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Validation  = require './validation'

  class Session extends Backbone.Model
    url: '/api/sessions'

    defaults: ->
      email       : null
      password    : null
      rememberMe  : false

    validate: (attributes) ->
      errors = {}

      unless attributes.email
        Validation.addError errors, 'email', 'Email is required.'

      unless attributes.password
        Validation.addError errors, 'password', 'Password is required.'

      if _(errors).isEmpty() then undefined else errors