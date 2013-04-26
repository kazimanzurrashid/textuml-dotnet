define (require) ->
  $                       = require 'jquery'
  _                       = require 'underscore'
  Backbone                = require 'backbone'
  DocumentListItemView    = require './documentitem'

  class DocumentListView extends Backbone.View
    el: '#document-list'

    events: ->
      'click .btn-toolbar .btn'       : 'sort'
      'keydown .list-container'       : 'navigate'
      'scroll .list-container'        : 'load'
      'click .list-container li'      : 'select'
      'dblclick .list-container li'   : 'open'

    initialize: ->
      @listContainer = @$ '.list-container'
      @list = @listContainer.find '> ul'
      @children = []
      @selectedId = undefined
      @template = _($('#document-item-template').html()).template()
      @listenTo @collection, 'reset sort', @render
      @listenTo @collection, 'add', @renderItem
      @render()

    getSelectedId: -> @selectedId

    resetSelection: ->
      @list.children().removeClass 'active'
      @selectedId = undefined

    scrollToTop: -> @listContainer.scrollTop 0

    render: ->
      @removeChildren()
      @collection.each (document) => @renderItem document, false
      @

    renderItem: (document, animate = true) ->
      child = new DocumentListItemView
        model: document
        template: @template

      @listenTo child, 'removing', =>
        index = _(@children).indexOf child
        @stopListening child, 'removing'
        @children.splice index, 1

      child.render()
        .$el
        .data('id', document.id)
        .appendTo @list

      child.$el.hide().fadeIn() if animate
      @children.push child

    remove: ->
      @removeChildren()
      super

    removeChildren: ->
      while child = @children.pop()
        @stopListening child, 'removing'
        child.remove false

    sort: (e) ->
      button = $ e.currentTarget
      sortAttribute = button.attr 'data-sort-attribute'
      sortOrder = button.attr 'data-sort-order'

      if sortAttribute?
        return false if sortAttribute is @collection.sortAttribute
        @collection.sortAttribute = sortAttribute
      else if sortOrder?
        return false if parseInt(sortOrder, 10) is @collection.sortOrder
        @collection.sortOrder = parseInt sortOrder, 10
      @collection.pageIndex = 0
      @collection.fetch().always => @scrollToTop()

    load: ->
      return false if @collection.pageIndex >= @collection.pageCount
      el = @listContainer.get 0
      if el.scrollTop + el.clientHeight + 125 > el.scrollHeight
        @collection.pageIndex += 1
        @collection.fetch
          update: true
          add: true
          remove: false

    navigate: (e) ->
      keyCode = e.which
      if keyCode is 38 or keyCode is 40 # up/down
        items = @list.children 'li'
        index = items.index @list.find('li.active')
        if keyCode is 38 # up
          return false unless index
          index -= 1
        else if keyCode is 40 # down
          return false if index >= items.length - 1
          index += 1
        $(items.get(index)).trigger 'click'
      else if keyCode is 13 or keyCode is 32 #enter/space
        e.preventDefault()
        @list.find('li.active').trigger 'dblclick'

    select: (e) -> @triggerEvent e, 'selected'

    open: (e) -> @triggerEvent e, 'opened'

    triggerEvent: (e, eventName) ->
      e.preventDefault()
      element = $ e.currentTarget
      id = element.data 'id'
      @resetSelection()
      element.addClass 'active'
      @selectedId = id
      @trigger eventName