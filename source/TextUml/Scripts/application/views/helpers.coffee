define (require) ->
  $         = require 'jquery'
  _         = require 'underscore'
  moment    = require 'moment'
  require 'form'

  formatAsRelativeTime: (date) -> moment(date).fromNow()

  formatAsHumanizeTime: (date) ->
    moment(date).format 'dddd, MMMM Do YYYY, h:mm a'

  hasModelErrors: (jqxhr) -> jqxhr.status is 400
  
  getModelErrors: (jqxhr) ->
    try
      response = $.parseJSON jqxhr.responseText
    catch e
      response = null

    if response
      modelStateProperty = _(response)
        .chain()
        .keys()
        .filter((key) -> key.toLowerCase() is 'modelstate')
        .first()
        .value()

      return response[modelStateProperty] if modelStateProperty
    undefined

  subscribeModelInvalidEvent: (model, element) ->
    model.once 'invalid', ->
      element.showFieldErrors errors: model.validationError