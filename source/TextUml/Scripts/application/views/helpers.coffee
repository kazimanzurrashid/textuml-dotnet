define (require) ->
  $         = require 'jquery'
  _         = require 'underscore'
  moment    = require 'moment'
  require 'form'

  difference = ->
    offset = new Date().getTimezoneOffset()
    if offset > 0 then -offset else Math.abs offset

  inLocalTime = (date) -> moment(date).add('m', difference())

  formatAsRelativeTime: (date) -> inLocalTime(date).fromNow()

  formatAsHumanizeTime: (date) ->
    inLocalTime(date).format 'dddd, MMMM Do YYYY, h:mm a'

  hasModelErrors: (jqxhr) -> jqxhr.status is 400
  
  getModelErrors: (jqxhr) ->
    try
      response = $.parseJSON(jqxhr.responseText);
    catch exception
      response = null

    if response
      modelStateProperty = _(response)
        .chain()
        .keys()
        .filter((key) -> key.toLowerCase() is 'modelstate')
        .first()
        .value();

      return response[modelStateProperty] if modelStateProperty
    undefined

  subscribeModelInvalidEvent: (model, element) ->
    model.once 'invalid', ->
      element.showFieldErrors errors: model.validationError