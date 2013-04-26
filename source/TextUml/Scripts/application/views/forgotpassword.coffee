define (require) ->
  Backbone          = require 'backbone'
  ForgotPassword    = require '../models/forgotpassword'
  Helpers           = require './helpers'
  events            = require '../events'
  require 'form'

  class ForgotPasswordView extends Backbone.View
    el: '#forgot-password-form'

    events:
      'submit': 'submit'

    submit: (e) ->
      e.preventDefault()
      @$el.hideSummaryError()
        .hideFieldErrors()

      forgotPassword = new ForgotPassword
      Helpers.subscribeModelInvalidEvent forgotPassword, @$el

      forgotPassword.save @$el.serializeFields(),
        success: -> events.trigger 'passwordResetTokenRequested'
        error: =>
          message = 'An unexpected error has occurred while sending '+
            'forgot password request.'
            @$el.showSummaryError { message }