define (require) ->
  $         = require 'jquery'
  _         = require 'underscore'
  require 'jquery.splitter'

  init: ->
    $('#content').splitter
      type: 'v'
      outline: true
      anchorToWindow: true
      minLeft: 100
      sizeLeft: 183
      dock: 'left'
      accessKey: 'L'
      cookie: 'side-bar'
    .on 'toggleDock resize', ->
      _(() -> $(window).trigger 'resize').defer()

    $('#main').splitter
      type: 'v'
      outline: true
      anchorToWindow: true
      minLeft: 200
      sizeLeft: 291
      accessKey: 'M'
      cookie: 'main-content'