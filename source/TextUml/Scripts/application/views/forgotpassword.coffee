define (require) ->
  MembershipFormmView   = require './membershipform'
  ForgotPassword        = require '../models/forgotpassword'

  class ForgotPasswordView extends MembershipFormmView
    el: '#forgot-password-form'

    handleError: ->
      message = 'An unexpected error has occurred while sending '+
        'forgot password request.'
        @$el.showSummaryError { message }

  ForgotPasswordView::modelType     = ForgotPassword
  ForgotPasswordView::successEvent  = 'passwordResetTokenRequested'

  ForgotPasswordView