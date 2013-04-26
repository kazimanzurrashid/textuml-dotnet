define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'

  class OutputGeneratorView extends Backbone.View
    el: '#output-text-area'

    initialize: ->
      events.on 'parseStarted', => @$el.val ''
      events.on 'parseWarning parseError', (e) =>
        value = @$el.val()
        value += '\n' if value
        value += e.message
        @$el.val value
      events.on 'parseCompleted', (e) =>
        value = ''
        if e.diagram
          value = @$el.val()
          value += '\n' if value
          value += 'Diagram generated successfully.'
        @$el.val value