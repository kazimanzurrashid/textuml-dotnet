define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'
  require 'bootstrap'

  class ExportedDocumentView extends Backbone.View
    el: '#exported-document-dialog'

    events:
      'shown'   : 'onDialogShown'
      'hide'    : 'onDialogHide'

    initialize: ->
      @messageBox = @$ '.alert'
      @image      = @$ 'img'

      @$el.modal show: false

      @listenTo events, 'documentExported', @onDocumentExported

    onDocumentExported: (e)->
      @image.prop 'src', e.data
      @$el.modal 'show'

    onDialogShown: -> @messageBox.fadeIn 400

    onDialogHide: -> @messageBox.hide()