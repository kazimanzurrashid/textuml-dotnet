define (require) ->
  Backbone    = require 'backbone'
  Helpers     = require './helpers'
  events      = require '../events'
  require 'form'

  class MembershipFormView extends Backbone.View
    modelType       : null
    successEvent    : null

    events:
      'submit': 'onSubmit'

    handleError: (jqxhr) -> throw new Error 'Not implemented'

    onSubmit: (e) ->
      e.preventDefault()
      @$el.hideSummaryError().hideFieldErrors()

      model = new @modelType
      Helpers.subscribeModelInvalidEvent model, @$el

      model.save @$el.serializeFields(),
        success: => events.trigger @successEvent
        error: (_, jqxhr) => @handleError jqxhr