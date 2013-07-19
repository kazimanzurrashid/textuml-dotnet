define (require) ->
  $           = require 'jquery'
  _           = require 'underscore'
  Backbone    = require 'backbone'
  Share       = require '../models/share'
  Shares      = require '../models/shares'
  events      = require '../events'
  helpers     = require './helpers'
  require 'bootstrap'
  require 'form'

  class ShareDocumentView extends Backbone.View
    el: '#document-share-dialog'

    events:
      'shown'                               : 'onDialogShown'
      'submit .new-share'                   : 'onAdd'
      'submit .share-list .edit-share'      : 'onRemove'
      'click .modal-footer .btn-primary'    : 'onSave'

    initialize: (options) ->
      @context = options.context

      @container = @$ '.modal-body > .share-list'
      @template = _(@$('#share-item-template').html()).template()

      @$el.modal show: false
      @listenTo events, 'shareDocument', @onShare

    render: ->
      @container.empty()
      @collection.each (model) =>
        $(@template model.toJSON()).appendTo @container
      @

    onDialogShown: -> @$el.putFocus()

    onAdd: (e) ->
      e.preventDefault()
      form = $ e.currentTarget
      share = new Share
      helpers.subscribeModelInvalidEvent share, form
      return false unless share.set form.serializeFields(), validate: true
      $(@template share.toJSON())
        .hide()
        .prependTo(@container)
        .fadeIn()
      form.resetFields().putFocus();

    onRemove: (e) ->
      e.preventDefault()
      $(e.currentTarget).fadeOut -> $(@).remove()

    onSave: (e) ->
      e.preventDefault()
      records = []
      @container
        .find('.edit-share')
        .each -> records.push { model: new Share, form: $ @ }

      valid = _(records)
        .chain()
        .map (r) ->
          helpers.subscribeModelInvalidEvent r.model, r.form
          r.model.set r.form.serializeFields(), validate: true
        .all()
        .value()

      return false unless valid
      @collection.reset silent: true
      @collection.set _(records).map (r) -> r.model
      @collection.update success: => @$el.modal 'hide'

    onShare: ->
      unless @context.isUserSignedIn()
        return events.trigger 'showMembership'

      if @context.isCurrentDocumentNew()
        return events.trigger 'showNewDocumentTitle'

      unless @context.isCurrentDocumentOwned()
        return $.showErrorbar 'Only document owner is allowed to share document.'

      @collection = new Shares
      @collection.documentId = @context.getCurrentDocumentId()
      @collection.fetch
        success: =>
          @render()
          @$el.modal 'show'