define (require) ->
  $           = require 'jquery'
  app         = require 'application/application'
  options     = require 'preloaded-data'
  require 'noext'
  require 'signalr'

  $ -> app.start options