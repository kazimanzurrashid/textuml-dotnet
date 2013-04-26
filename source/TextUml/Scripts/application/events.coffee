define (require) ->
  _         = require 'underscore'
  Backbone  = require 'backbone'

  events = {}
  _(events).extend Backbone.Events
  events