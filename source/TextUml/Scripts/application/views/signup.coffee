define (require) ->
  MembershipFormmView   = require './membershipform'
  User                  = require '../models/user'
  Helpers               = require './helpers'

  class SignUpView extends MembershipFormmView
    el: '#sign-up-form'

    handleError: (jqxhr) ->
      if Helpers.hasModelErrors jqxhr
        modelErrors = Helpers.getModelErrors jqxhr
        return @$el.showFieldErrors errors: modelErrors if modelErrors
      @$el.showSummaryError message: 'An unexpected error has ' +
        'occurred while signing up.'

  SignUpView::modelType     = User
  SignUpView::successEvent  = 'signedUp'

  SignUpView