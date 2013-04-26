define (require) ->
  Backbone          = require 'backbone'
  DocumentListView  = require './documentlist'
  events            = require '../events'
  require 'bootstrap'

  class DocumentBrowserView extends Backbone.View
    el: '#document-browser-dialog'

    events:
      'click .btn-primary': 'submit'

    initialize: (options) ->
      context = options.context

      @list = new DocumentListView collection: context.documents
      @listenTo @list, 'selected', => @submitButton.prop 'disabled', false
      @listenTo @list, 'opened', => @submitButton.trigger 'click'

      @submitButton = @$ '.btn-primary'

      @$el.modal(show: false)
        .on 'show', =>
          @canceled = true
          @list.scrollToTop()
          @list.resetSelection()
          @submitButton.prop 'disabled', true
        .on 'hidden', => @cancel() if @canceled

      events.on 'showDocuments', (e) =>
        @cancel = e.cancel
        @$el.modal 'show'

    submit: (e) ->
      e.preventDefault()
      @canceled = false
      @$el.modal 'hide'
      events.trigger 'documentSelected', id: @list.getSelectedId()