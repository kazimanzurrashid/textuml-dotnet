define (require) ->
  $                           = require 'jquery'
  _                           = require 'underscore'
  Backbone                    = require 'backbone'
  DocumentListItemView        = require './documentlistitem'
  DocumentListEditItemView    = require './documentlistedititem'

  class DocumentListView extends Backbone.View
    el                  : '#document-list'
    itemViewType        : DocumentListItemView
    editItemViewType    : DocumentListEditItemView

    events:
      'click .btn-toolbar .btn'       : 'onSort'
      'keydown .list-container'       : 'onNavigate'
      'scroll .list-container'        : 'onScroll'
      'click .list-container li'      : 'onSelect'
      'dblclick .list-container li'   : 'onOpen'

    initialize: ->
      @listContainer        = @$ '.list-container'
      @list                 = @listContainer.find '> ul'
      @children             = []
      @itemTemplate         = _(@$('#document-item-template').html()).template()
      @editItemTemplate     = _(@$('#document-edit-item-template').html()).template()

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
      @collection.each (document) => @renderItem document
      @

    renderItem: (document) ->
      child = if document.get('editable')
          new @editItemViewType model: document, template: @editItemTemplate
        else
          new @itemViewType model: document, template: @itemTemplate

      @listenTo child, 'removing', =>
        index = _(@children).indexOf child
        @stopListening child, 'removing'
        @children.splice index, 1

      child.render()
        .$el
        .attr('data-id', document.id)
        .appendTo @list

      @children.push child
      child

    remove: ->
      @removeChildren()
      super

    removeChildren: ->
      while child = @children.pop()
        @stopListening child, 'removing'
        child.remove false

    onSort: (e) ->
      button          = $ e.currentTarget
      sortAttribute   = button.attr 'data-sort-attribute'
      sortOrder       = button.attr 'data-sort-order'

      if sortAttribute
        return false if sortAttribute is @collection.sortAttribute
        @collection.sortAttribute = sortAttribute
      else if sortOrder
        return false if parseInt(sortOrder, 10) is @collection.sortOrder
        @collection.sortOrder = parseInt sortOrder, 10
      @collection.pageIndex = 0
      @collection.fetch
        reset   : true
        success : => @scrollToTop()

    onScroll: ->
      return false if @collection.pageIndex >= @collection.pageCount
      return false unless @isEndOfScrolling()
      @collection.pageIndex += 1
      @collection.fetch
        update    : true
        add       : true
        remove    : false

    onNavigate: (e) ->
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
        $(items.get index).trigger 'click'
      else if keyCode is 32 #spacebar
        e.preventDefault()
        @list.find('li.active').trigger 'dblclick'
      else
        true

    onSelect: (e) -> @triggerEvent e, 'selected'

    onOpen: (e) -> @triggerEvent e, 'opened'

    isEndOfScrolling: ->
      el = @listContainer.get 0
      el.scrollTop + el.clientHeight + 125 > el.scrollHeight

    triggerEvent: (e, eventName) ->
      e.preventDefault()
      element = $ e.currentTarget
      id = element.attr 'data-id'
      @resetSelection()
      element.addClass 'active'
      @selectedId = id
      @trigger eventName