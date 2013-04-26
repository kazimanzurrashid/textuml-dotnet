define (require) ->
  Base = require './base'

  class Composite extends Base
    constructor: (parent) ->
      @children = []
      super