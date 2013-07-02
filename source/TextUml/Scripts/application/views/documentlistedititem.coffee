define (require) ->
  $                       = require 'jquery'
  _                       = require 'underscore'
  DocumentListItemView    = require './documentlistitem'

  class DocumentListEditItemView extends DocumentListItemView

    events:
      'dblclick .display span'            : 'onEdit'
      'click [data-command="delete"]'     : 'onDestroy'
      'keydown input[type="text"]'        : 'onUpdateOrCancel'
      'blur input[type="text"]'           : 'onCancel'

    showDisplay: ->
      @$('.edit').hide()
      @$('.display').show()

    showEdit: ->
      @$('.display').hide()
      @$('.edit')
        .show()
        .find('input[type="text"]')
        .val(@model.get 'title')
        .select()
        .focus()

    onEdit: (e) ->
      e.preventDefault()
      e.stopPropagation()
      @showEdit()

    onCancel: (e) ->
      e.preventDefault()
      e.stopPropagation()
      @showDisplay()

    onUpdateOrCancel: (e) ->
      e.stopPropagation()
      if e.which is 13 # Enter
        e.preventDefault()
        title = $(e.currentTarget).val()
        if title and title isnt @model.get 'title'
          @model.save { title }
        @showDisplay()
      else if e.which is 27 # Escape
        e.preventDefault()
        @showDisplay()
      else
        true

    onDestroy: (e) ->
      e.preventDefault()
      e.stopPropagation()
      $.confirm
        prompt: 'Are you sure you want to delete ' +
          "<strong>#{@model.get 'title'}</strong>?"
        ok: => @model.destroy()