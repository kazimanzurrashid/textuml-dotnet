define (require) ->
  $                 = require 'jquery'
  Backbone          = require 'backbone'
  ChangePassword    = require '../models/changepassword'
  Session           = require '../models/session'
  helpers           = require './helpers'
  events            = require '../events'
  require 'bootstrap'
  require 'form'
  require 'confirm'

  class ProfileView extends Backbone.View
    el                  : '#profile-dialog'
    changePasswordType  : ChangePassword
    sessionType         : Session

    events:
      'shown'                   : 'onDialogShown'
      'submit form'             : 'onChangePassword'
      'click #sign-out-button'  : 'onSignOut'

    initialize: ->
      @changePasswordForm = @$ 'form'
      @$el.modal show: false
      @listenTo events, 'showProfile', @onShowProfile

    onShowProfile: ->
      @changePasswordForm
        .resetFields()
        .hideSummaryError()
        .hideFieldErrors()
      @$el.modal 'show'

    onDialogShown: -> @changePasswordForm.putFocus()

    onChangePassword: (e) ->
      e.preventDefault()
      @changePasswordForm
        .hideSummaryError()
        .hideFieldErrors()

      changePassword = new @changePasswordType
      helpers.subscribeModelInvalidEvent changePassword, @changePasswordForm

      changePassword.save @changePasswordForm.serializeFields(),
        success: =>
          @$el.modal 'hide'
          events.trigger 'passwordChanged'
        error: (_, jqxhr) =>
          if helpers.hasModelErrors jqxhr
            modelErrors = helpers.getModelErrors jqxhr
            if modelErrors
              return @changePasswordForm.showFieldErrors errors: modelErrors
          @changePasswordForm.showSummaryError
            message: 'An unexpected error has occurred while changing ' +
              'your password.'

    onSignOut: (e) ->
      e.preventDefault()
      @$el.modal 'hide'

      $.confirm
        prompt: 'Are you sure you want to sign out?'
        ok: =>
          (new @sessionType id: Date.now()).destroy
            success: -> events.trigger 'signedOut'