define (require) ->
  $         = require 'jquery'
  Backbone  = require 'backbone'
  events    = require '../events'

  class NavigationView extends Backbone.View
    el: '#navigation'

    events:
      'click [data-command]': 'handleCommand'

    handleCommand: (e) ->
      command = $(e.currentTarget).attr 'data-command'
      events.trigger command if command