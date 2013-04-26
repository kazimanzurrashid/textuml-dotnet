define (require) ->
  Base = require './base'

  class Message extends Base
    constructor: (
      @sender
      , @receiver
      , @name
      , @async
      , @callReturn
      , parent) ->
      super parent

    selfInvoking: -> @sender is @receiver