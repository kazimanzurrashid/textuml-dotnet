define (require) ->
  Composite = require './composite'

  class Group extends Composite
    constructor: (parent, @label, @type) ->
      super parent