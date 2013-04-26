define (require) ->
  $                 = require 'jquery'
  Backbone          = require 'backbone'
  ChangePassword    = require '../models/changepassword'
  Session           = require '../models/session'
  Helpers           = require './helpers'
  events            = require '../events'
  require 'bootstrap'
  require 'form'
  require 'confirm'

  class ProfileView extends Backbone.View
    el: '#profile-dialog'

    events:
      'submit form'             : 'changePassword'
      'click #sign-out-button'  : 'signOut'

    initialize: ->
      @changePasswordForm = @$ 'form'
      @$el.modal(show: false).on 'shown', =>
        @changePasswordForm.putFocus()

      events.on 'showProfile', =>
        @changePasswordForm
          .resetFields()
          .hideSummaryError()
          .hideFieldErrors()
        @$el.modal 'show'

    changePassword: (e) ->
      e.preventDefault()
      @changePasswordForm
        .hideSummaryError()
        .hideFieldErrors()

      changePassword = new ChangePassword
      Helpers.subscribeModelInvalidEvent changePassword, @changePasswordForm

      changePassword.save @changePasswordForm.serializeFields(),
        success: =>
          @$el.modal 'hide'
          events.trigger 'passwordChanged'
        error: (model, jqxhr) =>
          if Helpers.hasModelErrors jqxhr
            modelErrors = Helpers.getModelErrors jqxhr
            return @$el.showFieldErrors errors: modelErrors if modelErrors
          @$el.showSummaryError
            message: 'An unexpected error has occurred while changing' +
              'your password.'

    signOut: (e) ->
      e.preventDefault()
      @$el.modal 'hide'

      $.confirm
        prompt: 'Are you sure you want to sign out?'
        ok: ->
          (new Session id: Date.now()).destroy
            success: -> events.trigger 'signedOut'