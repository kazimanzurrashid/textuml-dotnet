define (require) ->
  $ = require 'jquery'
  require 'signalr'
  require 'hubs'

  proxy = $.connection.sharingHub

  start: ->
    $.connection.hub.start().done ->
      console.log 'Signalr Connected'

  stop: ->