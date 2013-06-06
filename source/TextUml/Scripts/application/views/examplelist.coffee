define (require) ->
  $                   = require 'jquery'
  _                   = require 'underscore'
  Backbone            = require 'backbone'
  Example             = require '../models/example'
  Examples            = require '../models/examples'
  events              = require '../events'

  generateData = ->
    new Examples [
        new Example
          display: 'Sync call'
          snippet: 'A -> B: Sync message'
        new Example
          display: 'Sync return'
          snippet: 'A <-- B: Sync message return'
        new Example
          display: 'Async call'
          snippet: 'A ->> B: Async message'
        new Example
          display: 'Async return'
          snippet: 'A <<-- B: Async message return'
        new Example
          display: 'Loop'
          snippet: 'loop n times\n  \' nested calls goes here...\nend'
        new Example
          display: 'If'
          snippet: 'opt condition\n  \' nested calls goes here...\nend'
        new Example
          display: 'If/Else'
          snippet: 'alt condition 1\n  \' nested calls goes here...\nelse ' +
            'condition 2\n  \' nested calls goes here...\nend'
    ]

  class ExampleListView extends Backbone.View
    el: '#example-list'

    events:
      'click li': 'select'

    initialize: ->
      @template     = _('<li>{{display}}</li>').template()
      @collection   = generateData()
      @render()

    render: ->
      @$el.empty()
      @collection.each (example) =>
        @$el.append $(@template example.toJSON()).attr 'data-cid', example.cid
      @

    select: (e) ->
      cid = $(e.currentTarget).attr 'data-cid'
      example = @collection.get cid
      events.trigger 'exampleSelected', { example }