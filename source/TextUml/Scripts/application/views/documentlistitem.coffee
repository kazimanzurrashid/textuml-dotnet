define (require) ->
  _           = require 'underscore'
  Backbone    = require 'backbone'
  helpers     = require './helpers'

  class DocumentListItemView extends Backbone.View
    tagName: 'li'

    initialize: (options) ->
      @template = options.template
      @listenTo @model, 'change', @render
      @listenTo @model, 'destroy', @remove

    render: ->
      attributes = _(@model.toJSON()).extend
        lastUpdatedInRelativeTime: ->
          helpers.formatAsRelativeTime @updatedAt
        lastUpdatedInHumanizeTime: ->
          helpers.formatAsHumanizeTime @updatedAt
          
      @$el.html @template(attributes)
      @

    remove: (notify = true) ->
      return super unless notify
      @trigger 'removing'
      @$el.fadeOut => super
      @