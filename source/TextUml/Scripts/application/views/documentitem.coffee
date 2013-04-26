define (require) ->
  $           = require 'jquery'
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Helpers     = require './helpers'

  class DocumentListItemView extends Backbone.View
    tagName: 'li'

    events:
      'dblclick .display span'            : 'edit'
      'click [data-command="delete"]'     : 'destroy'
      'keydown input[type="text"]'        : 'updateOrCancel'
      'blur input[type="text"]'           : 'cancel'

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

    edit: (e) ->
      e.preventDefault()
      e.stopPropagation()
      @showEdit()

    cancel: (e) ->
      e.preventDefault()
      e.stopPropagation()
      @showDisplay()

    updateOrCancel: (e) ->
      e.stopPropagation()
      if e.which is 13
        e.preventDefault()
        title = $(e.currentTarget).val()
        if title and title isnt @model.get 'title'
          @model.save { title }
        @showDisplay()
      else if e.which is 27
        e.preventDefault()
        @showDisplay()

    destroy: (e) ->
      e.preventDefault()
      e.stopPropagation()
      $.confirm
        prompt: 'Are you sure you want to delete ' +
          "<strong>#{@model.get 'title'}</strong>?"
        ok: => @model.destroy()

    showDisplay: ->
      @$('.edit').hide()
      @$('.display').show()

    showEdit: ->
      @$('.display').hide()
      @$('.edit').show()
      .find('input[type="text"]')
      .val(@model.get 'title')
      .select()
      .focus()