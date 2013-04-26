define (require) ->
  $           = require 'jquery'
  Backbone    = require 'backbone'
  events      = require './events'
  require 'flashbar'
  require 'confirm'

  class Router extends Backbone.Router
    routes:
      '!/documents/new'   : 'newDocument'
      '!/documents/:id'   : 'openDocument'
      '!/documents'       : 'openDocuments'

    constructor: ->
      super
      @localHistory = []
      @on 'all', =>
        path = Backbone.history.fragment
        if @localHistory.length and
        @localHistory[@localHistory.length - 1] is path
          return false
        @localHistory.push path

    initialize: (options) ->
      @context = options.context
      @clientUrl = options.clientUrl

    newDocument: ->
      @promptForUnsavedChanges =>
        @context.resetCurrentDocument()
        events.trigger 'documentChanged'

    openDocument: (id) ->
      action = =>
        @context.setCurrentDocument(id).always (document) =>
          unless document
            $.showErrorbar "Document with id <strong>#{id}</strong> " +
              'does not exist.'
            @previous()
          events.trigger 'documentChanged'

      @promptForUnsavedChanges =>
        unless @context.isUserSignedIn()
          return events.trigger 'showMembership',
            ok: => action()
            cancel: => @previous()
        action()

    openDocuments: ->
      action = =>
        @context.resetCurrentDocument()
        events.trigger 'documentChanged'
        events.trigger 'showDocuments', cancel: => @previous()

      @promptForUnsavedChanges =>
        unless @context.isUserSignedIn()
          return events.trigger 'showMembership',
            ok: => action()
            cancel: => @previous()
        action()

    promptForUnsavedChanges: (callback) ->
      return false if @implicitRedirect
      unless @context.isCurrentDocumentDirty()
        callback()
        return false

      $.confirm
        prompt: 'Your document has unsaved changes, if you navigate away ' +
            'your changes will be lost. Click OK to continue, or Cancel to ' +
            'stay on the current page.'
        ok: -> callback()
        cancel: => @previous()
      true

    previous: ->
      if @localHistory.length > 1
        path = @localHistory[@localHistory.length - 2]
      else
        path = @clientUrl 'documents', 'new'
      @implicitRedirect = true
      @navigate path
      @implicitRedirect = false