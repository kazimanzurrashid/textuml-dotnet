define (require) ->
  $         = require 'jquery'
  _         = require 'underscore'
  require 'jquery.splitter'

  init: ->
    $('#content').splitter
      type: 'v'
      outline: true
      anchorToWindow: true
      dock: 'left'
      accessKey: 'L'
      cookie: 'side-bar'
    .on 'toggleDock resize', ->
      _(() -> $(window).trigger 'resize').defer()

    $('#main').splitter
      type: 'v'
      outline: true
      anchorToWindow: true
      accessKey: 'M'
      cookie: 'main-content'