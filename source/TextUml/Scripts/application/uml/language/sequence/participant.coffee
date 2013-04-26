define (require)->
  trim = require('./helpers').trim

  class Participant
    handles: (context) ->
      match = context.line.match /^participant\s+(.+)/i
      return false unless match
      text = match[1]
      match = text.match /^"(\w.*)"\s+as\s+(\w.*)/i
      if match
        name = trim match[1]
        alias = trim match[2]
      else
        name = trim text

      if context.findParticipant name
        errorMessage = "Error on line #{context.getLineNumber()}, " +
          "participant with name \"#{name}\" already exists."
        throw new Error errorMessage

      if alias? and context.findParticipant alias
        errorMessage = "Error on line #{context.getLineNumber()}, " +
          "participant with alias \"#{alias}\" already exists."
        throw new Error errorMessage

      context.addParticipant name, alias
      true