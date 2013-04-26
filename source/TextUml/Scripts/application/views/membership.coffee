define (require) ->
  Backbone            = require 'backbone'
  SignInView          = require './signin'
  ForgotPasswordView  = require './forgotpassword'
  SignUpView          = require './signup'
  events              = require '../events'
  require 'bootstrap'
  require 'form'

  class MembershipView extends Backbone.View
    el: '#membership-dialog'

    initialize: ->
      @signIn = new SignInView
      @forgotPassword = new ForgotPasswordView
      @signUp = new SignUpView

      tabHeaders = @$el.find('a[data-toggle="tab"]')
        .on 'shown', (e) =>
          @$el.find(e.target.hash).putFocus() if e.target?.hash?

      @$el.modal(show: false)
        .on 'show', =>
          @canceled = true
          @$el.resetFields()
            .hideSummaryError()
            .hideFieldErrors()
        .on 'shown', =>
          @$el.putFocus()
        .on 'hidden', =>
          if @canceled and @cancel?
            @cancel()
          else if @ok?
            @ok()

      events.on 'showMembership', (e) =>
        @ok = e?.ok
        @cancel = e?.cancel
        tabHeaders.first().trigger 'click'
        @$el.modal 'show'

      events.on 'signedIn passwordResetTokenRequested signedUp', =>
        @canceled = false
        @$el.modal 'hide'