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
        fragment = Backbone.history.fragment
        if @localHistory.length and @localHistory[@localHistory.length - 1] is fragment
          return false
        @localHistory.push fragment
         
    initialize: (options) ->
      @context = options.context
      @clientUrl = options.clientUrl

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
        @context.resetCurrentDocument()
        events.trigger 'documentChanged'
        events.trigger 'showDocuments', cancel: => @redirectToPrevious()

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

    redirectToPrevious: ->
      if @localHistory.length > 1
        path = @localHistory[@localHistory.length - 2]
      else
        path = @clientUrl 'documents', 'new'
      @navigate path, true