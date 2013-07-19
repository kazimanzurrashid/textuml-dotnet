define (require) ->
  Backbone    = require 'backbone'
  helpers     = require './helpers'
  events      = require '../events'
  require 'form'

  class MembershipFormView extends Backbone.View
    modelType       : null
    successEvent    : null

    events:
      'submit': 'onSubmit'

    onSubmit: (e) ->
      e.preventDefault()
      @$el.hideSummaryError().hideFieldErrors()

      model = new @modelType
      helpers.subscribeModelInvalidEvent model, @$el

      model.save @$el.serializeFields(),
        success: => events.trigger @successEvent
        error: (_, jqxhr) => @handleError jqxhr