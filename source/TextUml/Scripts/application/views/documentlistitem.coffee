define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Helpers     = require './helpers'

  class DocumentListItemView extends Backbone.View
    tagName: 'li'

    initialize: (options) ->
      @template = options.template
      @listenTo @model, 'change', @render
      @listenTo @model, 'remove destroy', @remove

    render: ->
      attributes = _(@model.toJSON()).extend
        lastUpdatedInRelativeTime: ->
          Helpers.formatAsRelativeTime @updatedAt
        lastUpdatedInHumanizeTime: ->
          Helpers.formatAsHumanizeTime @updatedAt
          
      @$el.html @template(attributes)
      @

    remove: (notify = true) ->
      return super unless notify
      @trigger 'removing'
      @$el.fadeOut => super
      @