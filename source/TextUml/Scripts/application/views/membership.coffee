define (require) ->
  _                   = require 'underscore'
  Backbone            = require 'backbone'
  SignInView          = require './signin'
  ForgotPasswordView  = require './forgotpassword'
  SignUpView          = require './signup'
  events              = require '../events'
  require 'bootstrap'
  require 'form'

  class MembershipView extends Backbone.View
    el                        : '#membership-dialog'
    signInViewType            : SignInView
    forgotPasswordViewType    : ForgotPasswordView
    signUpViewType            : SignUpView

    events:
      'shown a[data-toggle="tab"]'  : 'onTabHeaderShown'
      'show'                        : 'onDialogShow'
      'shown'                       : 'onDialogShown'
      'hidden'                      : 'onDialogHidden'

    initialize: ->
      @signIn             = new @signInViewType
      @forgotPassword     = new @forgotPasswordViewType
      @signUp             = new @signUpViewType

      @firstTabHead = @$('a[data-toggle="tab"]').first()

      @$el.modal show: false

      @listenTo events, 'showMembership', @onShowMembership
      @listenTo events,
        'signedIn passwordResetTokenRequested signedUp',
        @onSignedInOrPasswordResetTokenRequestedOrSignedUp

    onShowMembership: (e) ->
      @ok     = if e and _(e.ok).isFunction() then e.ok else undefined
      @cancel = if e and _(e.cancel).isFunction() then e.cancel else undefined

      @firstTabHead.trigger 'click'
      @$el.modal 'show'

    onSignedInOrPasswordResetTokenRequestedOrSignedUp: ->
      @canceled = false
      @$el.modal 'hide'

    onTabHeaderShown: (e) ->
      return false unless e.target?.hash?
      @$(e.target.hash).putFocus()

    onDialogShow: ->
      @canceled = true
      @$el.resetFields()
        .hideSummaryError()
        .hideFieldErrors()

    onDialogShown: -> @$el.putFocus()

    onDialogHidden: ->
      if @canceled and @cancel?
        @cancel()
      else if @ok?
        @ok()
      else
        false