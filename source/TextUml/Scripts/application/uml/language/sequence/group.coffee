define (require)->
  _         = require 'underscore'
  GroupType = require '../../models/sequence/grouptype'
  trim      = require('./helpers').trim

  GroupNames = _(GroupType).values()
  Regex = new RegExp("^[\\s|\\t]*(#{GroupNames.join '|'})\\s*(.*)", 'i')

  class Group
    handles: (context) ->
      if match = context.line.match Regex
        context.addGroup trim(match[1]), trim(match[2])
        return true
      false