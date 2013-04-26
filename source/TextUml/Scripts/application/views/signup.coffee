define (require) ->
  Backbone    = require 'backbone'
  User        = require '../models/user'
  Helpers     = require './helpers'
  events      = require '../events'
  require 'form'

  class SignUpView extends Backbone.View
    el: '#sign-up-form'

    events:
      'submit': 'submit'

    submit: (e) ->
      e.preventDefault()
      @$el.hideSummaryError()
        .hideFieldErrors()

      user = new User
      Helpers.subscribeModelInvalidEvent user, @$el

      user.save @$el.serializeFields(),
        success: -> events.trigger 'signedUp'
        error: (model, jqxhr) =>
          if Helpers.hasModelErrors jqxhr
            modelErrors = Helpers.getModelErrors jqxhr
            return @$el.showFieldErrors errors: modelErrors if modelErrors
          @$el.showSummaryError message: 'An unexpected error has ' +
            'occurred while signing up.'