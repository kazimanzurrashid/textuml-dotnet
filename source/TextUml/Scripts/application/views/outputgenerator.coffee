define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'

  class OutputGeneratorView extends Backbone.View
    el: '#output-text-area'

    initialize: ->
      @listenTo events, 'parseStarted', @onParseStarted
      @listenTo events, 'parseWarning parseError', @onParseWarningOrError
      @listenTo events, 'parseCompleted', @onParseCompleted

    onParseStarted: -> @$el.val ''

    onParseWarningOrError: (e) ->
      value = @$el.val()
      value += '\n' if value
      value += e.message
      @$el.val value

    onParseCompleted: (e) ->
      return false unless e?.diagram?
      value = @$el.val()
      value += '\n' if value
      value += 'Diagram generated successfully.'
      @$el.val value