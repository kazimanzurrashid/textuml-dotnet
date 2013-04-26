define (require) ->
  Backbone  = require 'backbone'
  Example   = require './example'

  class Examples extends Backbone.Collection
    model: Example