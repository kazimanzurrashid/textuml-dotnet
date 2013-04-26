define (require) ->
  Backbone = require 'backbone'

  class Example extends Backbone.Model
    defaults: ->
      display: null
      snippet: null