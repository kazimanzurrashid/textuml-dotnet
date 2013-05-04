define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'
  require 'form'
  require 'bootstrap'

  class DocumentTitleView extends Backbone.View
    el: '#document-title-dialog'

    events:
      'show'                : 'onDialogShow'
      'shown'               : 'onDiaglogShown'
      'click button'        : 'onSubmit'

    initialize: (options) ->
      @context    = options.context
      @input      = @$ 'input[type="text"]'

      @$el.modal show: false
      @listenTo events, 'showNewDocumentTitle', @onShowNewDocumentTitle

    onShowNewDocumentTitle: ->
      @input.val @context.getNewDocumentTitle()
      @$el.modal 'show'

    onDialogShow: -> @$el.hideFieldErrors()

    onDiaglogShown: -> @$el.putFocus()

    onSubmit: (e) ->
      e.preventDefault()
      title = @input.val()
      unless title
        errors =
          title: ['Title is required.']
        return @$el.showFieldErrors { errors }
      @context.setCurrentDocumentTitle title
      @$el.modal 'hide'
      events.trigger 'newDocumentTitleAssigned'