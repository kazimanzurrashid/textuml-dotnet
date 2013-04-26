define (require) ->
  $ = require 'jquery'

  fontFamily  = $('body').css 'fontFamily'
  fontSize    = parseInt $('body').css('fontSize'), 10

  lineSize      : 1
  arrowSize     : 8
  borderColor   : '#a80036'
  backColor     : '#ffffcf'
  foreColor     : '#000'
  fontFamily    : fontFamily
  fontSize      : fontSize