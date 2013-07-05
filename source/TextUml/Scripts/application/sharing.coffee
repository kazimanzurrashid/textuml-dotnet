define (require) ->
  $         = require 'jquery'
  events    = require './events'
  require 'signalr'
  require 'noext!/signalr/hubs'

  proxy = $.connection.sharingHub

  proxy.client.subscribed = (documentId, user) ->
    console.log "User #{user} joined to document ##{documentId}"
    events.trigger 'userJoined', { documentId, user }

  proxy.client.updated = (documentId, content) ->
    console.log "Document ##{documentId} content changed by #{user}"
    events.trigger 'documentContentChanged', { documentId, content, user }

  proxy.client.unsubscribed = (documentId, user) ->
    console.log "User #{user} left from document ##{documentId}"
    events.trigger 'userLeft', { documentId, user }

  class Sharing
    constructor: (options) ->
      @context = options.context
      @documentId = null

    start: ->
      $.connection.hub.start().done =>
        console.log 'Signalr Connected'

        events.on 'documentChanged', (e) =>
          id = @documentId
          if id
            proxy.server.unsubscribe(id).done =>
              @documentId = undefined

          if @context.isCurrentDocumentShared()
            id = @context.getCurrentDocumentId()
            proxy.server.subscribe(id).done =>
              @documentId = id

    stop: -> events.off 'documentChanged'