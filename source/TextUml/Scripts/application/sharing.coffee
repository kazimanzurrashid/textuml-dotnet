define (require) ->
  $ = require 'jquery'
  require 'signalr'
  require 'noext!/signalr/hubs'

  proxy = $.connection.sharingHub

  start: ->
    $.connection.hub.start().done ->
      proxy.server.hello();
      console.log 'Signalr Connected'

  stop: ->