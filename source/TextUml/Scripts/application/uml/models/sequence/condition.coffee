define (require) ->
  _         = require 'underscore'
  Composite = require './composite'
  Group     = require './group'

  class Condition extends Composite
    createIfGroup: (label) -> new Group @, label

    addElseGroup: (label) -> new Group @, label

    getIfGroup: -> _(@children).first()

    getElseGroups: -> _(@children).rest()