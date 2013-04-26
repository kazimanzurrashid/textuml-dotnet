define (require) ->
  Backbone    = require 'backbone'
  Session     = require '../models/session'
  Helpers     = require './helpers'
  events      = require '../events'
  require 'form'

  class SignInView extends Backbone.View
    el: '#sign-in-form'

    events:
      'submit': 'submit'

    submit: (e) ->
      e.preventDefault()
      @$el.hideSummaryError()
        .hideFieldErrors()

      session = new Session
      Helpers.subscribeModelInvalidEvent session, @$el

      session.save @$el.serializeFields(),
        success: -> events.trigger 'signedIn'
        error: (model, jqxhr) =>
          message = if Helpers.hasModelErrors jqxhr
              'Invalid credentials.'
            else
              'An unexpected error has occurred while signing in.'
          @$el.showSummaryError { message }