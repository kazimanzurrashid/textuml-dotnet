define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Validation  = require './validation'

  class ChangePassword extends Backbone.Model
    url: -> '/api/passwords/change'

    defaults: ->
      oldPassword     : null
      newPassword     : null
      confirmPassword : null

    validate: (attributes) ->
      errors = {}
      unless attributes.oldPassword
        Validation.addError errors, 'oldPassword', 'Old password is required.'

      if attributes.newPassword
        unless Validation.isValidPasswordLength attributes.newPassword
          Validation.addError errors, 'newPassword', 'New password length ' +
            'must be between 6 to 64 characters.'
      else
        Validation.addError errors, 'newPassword', 'New password is required.'

      if attributes.confirmPassword
        if attributes.newPassword and
        attributes.confirmPassword isnt attributes.newPassword
          Validation.addError errors, 'confirmPassword', 'New password and ' +
            'confirmation password do not match.'
      else
        Validation.addError errors, 'confirmPassword', 'Confirm password is ' +
          'required.'

      if _(errors).isEmpty() then undefined else errors