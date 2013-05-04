define (require) ->
  $         = require 'jquery'
  Backbone  = require 'backbone'
  Renderer  = require '../uml/drawing/sequence/renderer'
  events    = require '../events'
  require 'flashbar'

  class CanvasView extends Backbone.View
    el              : '#canvas-container'
    rendererType    : Renderer

    initialize: (options) ->
      @context    = options.context
      @renderer   = new @rendererType

      @listenTo events, 'parseStarted', @onParseStarted
      @listenTo events, 'parseCompleted', @onParseCompleted
      @listenTo events, 'exportDocument', @onExportDocument

    onParseStarted: -> @renderer.reset()

    onParseCompleted: (e) ->
      title = null
      if e?.diagram
        title = e.diagram.title?.text
        @renderer.render e.diagram
      @context.setCurrentDocumentTitle title

    onExportDocument: ->
      try
        data = @renderer.serialize()
        events.trigger 'documentExported', { data }
      catch exception
        $.showErrorbar exception.message