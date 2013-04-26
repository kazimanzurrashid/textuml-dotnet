define (require) ->
  $                   = require 'jquery'
  _                   = require 'underscore'
  Backbone            = require 'backbone'
  Example             = require '../models/example'
  Examples            = require '../models/examples'
  ExampleListItemView = require './exampleitem'
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
      @children = []
      @template = _('{{display}}').template()
      @collection = generateData()
      @listenTo @collection, 'reset', @render
      @listenTo @collection, 'add', @renderItem
      @render()

    render: ->
      @removeChildren()
      @collection.each (example) => @renderItem example, false
      @

    renderItem: (example, animate = true) ->
      child = new ExampleListItemView
        model: example
        template: @template

      @listenTo child, 'removing', =>
        index = _(@children).indexOf child
        @stopListening child, 'removing'
        @children.splice index, 1

      child.render()
        .$el
        .data('id', example.cid)
        .appendTo @$el

      child.$el.hide().fadeIn() if animate

      @children.push child

    remove: ->
      @removeChildren()
      super

    removeChildren: ->
      while child = @children.pop()
        @stopListening child, 'removing'
        child.remove false

    select: (e) ->
      cid = $(e.currentTarget).data 'id'
      example = @collection.get cid
      events.trigger 'exampleSelected', { example }