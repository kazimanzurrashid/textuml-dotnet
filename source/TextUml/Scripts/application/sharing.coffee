define (require) ->
  $         = require 'jquery'
  events    = require './events'
  require 'signalr'
  require 'noext!/signalr/hubs'

  proxy = $.connection.sharingHub

  proxy.client.subscribed = (documentId, user) ->
    events.trigger 'userJoined',
      documentId: parseInt documentId, 10
      user: user

  proxy.client.updated = (documentId, content, user) ->
    events.trigger 'documentContentChanged',
      documentId: parseInt documentId, 10
      content: content
      user: user

  proxy.client.unsubscribed = (documentId, user) ->
    events.trigger 'userLeft',
      documentId: parseInt documentId, 10
      user: user

  class Sharing
    constructor: (options) ->
      @context = options.context
      @documentId = null

    start: ->
      $.connection.hub.start().done =>
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