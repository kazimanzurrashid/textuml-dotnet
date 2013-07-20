define (require) ->
  $           = require 'jquery'
  _           = require 'underscore'
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
      @navigationHistory = []
      @on 'all', =>
        path = Backbone.history.fragment
        if @navigationHistory.length and _(@navigationHistory).last() is path
          return false
        @navigationHistory.push path
         
    initialize: (options) ->
      @context = options.context
      @defaultUrl = options.defaultUrl

    newDocument: ->
      @context.resetCurrentDocument()
      events.trigger 'documentChanged'

    openDocument: (id) ->
      @ensureSignedIn =>
        @context.setCurrentDocument id, (document) =>
          unless document
            $.showErrorbar "Document with id <strong>#{id}</strong> " +
              'does not exist.'
            @redirecToPrevious()
          events.trigger 'documentChanged'

    openDocuments: ->
      @ensureSignedIn =>
        events.trigger 'showDocuments', cancel: => @redirectToPrevious false

    ensureSignedIn: (action) ->
      unless @context.isUserSignedIn()
        return events.trigger 'showMembership',
          ok: =>
            if @context.isUserSignedIn()
              action()
            else
              @redirectToPrevious()
          cancel: =>
            @redirectToPrevious()
      action()

    redirectToPrevious: (replace = true) ->
      if @navigationHistory.length > 1
        path = @navigationHistory[@navigationHistory.length - 2]
      else
        path = @defaultUrl
      @navigate path, replace