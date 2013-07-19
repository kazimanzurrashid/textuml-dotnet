define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  validation  = require './validation'

  class User extends Backbone.Model
    url: '/api/users'

    defaults: ->
      email           : null
      password        : null
      confirmPassword : null

    validate: (attributes) ->
      errors = {}

      if attributes.email
        unless validation.isValidEmailFormat attributes.email
          validation.addError errors, 'email', 'Invalid email format.'
      else
        validation.addError errors, 'email', 'Email is required.'

      if attributes.password
        unless validation.isValidPasswordLength attributes.password
          validation.addError errors, 'password', 'Password length must be ' +
            'between 6 to 64 characters.'
      else
        validation.addError errors, 'password', 'Password is required.'

      if attributes.confirmPassword
        if attributes.password and
          attributes.confirmPassword isnt attributes.password
           validation.addError errors, 'confirmPassword', 'Password and ' +
             'confirmation password do not match.'
      else
        validation.addError errors, 'confirmPassword', 'Confirm password is ' +
          'required.'

      if _(errors).isEmpty() then undefined else errors