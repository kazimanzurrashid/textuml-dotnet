define (require)->
  trim = require('./helpers').trim

  class Title
    handles: (context) ->
      match = context.line.match /^title\s+(\w.*)/i
      return false unless match
      if context.title or context.participants.length or context.commands.length
        errorMessage = "Error on line #{context.getLineNumber()}, " +
          'title must be defined before any other instruction.'
        throw new Error errorMessage

      context.setTitle trim(match[1])
      true