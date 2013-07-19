define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  validation  = require './validation'

  class Session extends Backbone.Model
    url: '/api/sessions'

    defaults: ->
      email       : null
      password    : null
      rememberMe  : false

    validate: (attributes) ->
      errors = {}

      unless attributes.email
        validation.addError errors, 'email', 'Email is required.'

      unless attributes.password
        validation.addError errors, 'password', 'Password is required.'

      if _(errors).isEmpty() then undefined else errors