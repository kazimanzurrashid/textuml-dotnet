define (require) ->
  Backbone  = require 'backbone'
  events    = require '../events'
  require 'bootstrap'

  class ExportedDocumentView extends Backbone.View
    el: '#exported-document-dialog'

    initialize: ->
      box = @$ '.alert'
      image = @$ 'img'

      @$el.modal(show: false)
        .on 'shown', ->
          box.fadeIn 400
        .on 'hide', ->
          box.hide()

      events.on 'exported', (e) =>
        image.prop 'src', e.data
        @$el.modal 'show'