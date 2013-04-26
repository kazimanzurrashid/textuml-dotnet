define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'
  require 'form'
  require 'bootstrap'

  class DocumentTitleView extends Backbone.View
    el: '#document-title-dialog'

    events:
      'click button': 'submit'

    initialize: (options) ->
      @context = options.context
      @input = @$ 'input[type="text"]'
      @$el.modal(show: false)
        .on 'show', =>
          @$el.hideFieldErrors()
        .on 'shown', =>
          @input.select().focus()

      events.on 'showNewDocumentTitle', =>
        @input.val @context.getNewDocumentTitle()
        @$el.modal 'show'

    submit: (e) ->
      e.preventDefault()
      title = @input.val()
      unless title
        errors =
          title: ['Title is required.']
        return @$el.showFieldErrors { errors }
      @context.setCurrentDocumentTitle title
      @$el.modal 'hide'
      events.trigger 'newDocumentTitleAssigned'