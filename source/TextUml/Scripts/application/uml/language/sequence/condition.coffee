define (require)->
  trim = require('./helpers').trim

  class Condition
    handles: (context) ->
      if match = context.line.match /^[\s\t]*alt\s*(.*)/i
        context.addIf trim(match[1])
        return true
      else if match = context.line.match /^[\s\t]*else\s*(.*)/i
        context.addElse trim(match[1])
        return true
      false