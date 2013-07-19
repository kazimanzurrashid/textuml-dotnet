define (require) ->
  MembershipFormmView   = require './membershipform'
  Session               = require '../models/session'
  helpers               = require './helpers'

  class SignInView extends MembershipFormmView
    el: '#sign-in-form'

    handleError: (jqxhr) ->
      message = if helpers.hasModelErrors jqxhr
          'Invalid credentials.'
        else
          'An unexpected error has occurred while signing in.'
      @$el.showSummaryError { message }

  SignInView::modelType     = Session
  SignInView::successEvent  = 'signedIn'

  SignInView