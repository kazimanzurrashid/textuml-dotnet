define (require) ->
  $         = require 'jquery'
  Backbone  = require 'backbone'
  Renderer  = require '../uml/drawing/sequence/renderer'
  events    = require '../events'
  require 'flashbar'

  class CanvasView extends Backbone.View
    el: '#canvas-container'

    initialize: (options) ->
      context = options.context
      @renderer = new Renderer

      events.on 'parseStarted', => @renderer.clear()

      events.on 'parseCompleted', (e) =>
        title = null
        if e.diagram
          title = e.diagram.title?.text
          @renderer.render e.diagram
        context.setCurrentDocumentTitle title

      events.on 'exportDocument', =>
        try
          data = @renderer.serialize()
          events.trigger 'documentExported', { data }
        catch exception
          $.showErrorbar exception.message