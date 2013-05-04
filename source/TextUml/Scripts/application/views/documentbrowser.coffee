define (require) ->
  Backbone          = require 'backbone'
  DocumentListView  = require './documentlist'
  events            = require '../events'
  require 'bootstrap'

  class DocumentBrowserView extends Backbone.View
    el              : '#document-browser-dialog'
    listViewType    : DocumentListView

    events:
      'show'                : 'onDiaglogShow'
      'hidden'              : 'onDiaglogHidden'
      'click .btn-primary'  : 'onSubmit'

    initialize: (options) ->
      @list           = new @listViewType collection: options.context.documents
      @submitButton   = @$ '.btn-primary'

      @$el.modal show: false

      @listenTo events, 'showDocuments', @onShowDocuments
      @listenTo @list, 'selected', @onDocumentSelected
      @listenTo @list, 'opened', @onDocumentOpened

    onShowDocuments: (e) ->
      @cancel = e.cancel
      @$el.modal 'show'

    onDiaglogShow: ->
      @canceled = true
      @list.scrollToTop()
      @list.resetSelection()
      @submitButton.prop 'disabled', true

    onDialogHidden: ->
      return false unless @canceled
      @cancel?()
     
    onDocumentSelected: -> @submitButton.prop 'disabled', false

    onDocumentOpened: -> @submitButton.trigger 'click'

    onSubmit: (e) ->
      e.preventDefault()
      @canceled = false
      @$el.modal 'hide'
      events.trigger 'documentSelected', id: @list.getSelectedId()