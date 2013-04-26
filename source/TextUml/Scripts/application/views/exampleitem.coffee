define (require) ->
  Backbone  = require 'backbone'

  class ExampleListItemView extends Backbone.View
    tagName: 'li'

    initialize: (options) ->
      @template = options.template
      @listenTo @model, 'change', @render
      @listenTo @model, 'remove destroy', @remove

    render: ->
      @$el.html @template(@model.toJSON())
      @

    remove: (notify = true) ->
      return super unless notify
      @trigger 'removing'
      @$el.fadeOut => super
      @