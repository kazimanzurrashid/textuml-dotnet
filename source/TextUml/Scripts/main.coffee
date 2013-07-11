define (require) ->
  $           = require 'jquery'
  app         = require 'application/application'
  options     = require 'preloaded-data'

  $ -> app.start options