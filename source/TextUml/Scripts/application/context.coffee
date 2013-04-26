define (require) ->
  Documents = require './models/documents'

  class Context
    constructor: (options = {}) ->
      @resetCurrentDocument()
      @documents = new Documents
      if options.userSignedIn
        if options.documents
          @documents.reset options.documents.data
          @documents.setCounts options.documents.count
        @userSignedIn false

    isUserSignedIn: -> @signedIn

    userSignedIn: (fetchDocuments = true) ->
      @signedIn = true
      @documents.fetch reset: true if fetchDocuments

    userSignedOut: ->
      @signedIn = false
      @documents.reset()
      @resetCurrentDocument()

    resetCurrentDocument: ->
      @id = null
      @title = null
      @content = null

    setCurrentDocument: (id) ->
      @documents.fetchOne(id)
        .done (document) =>
          attributes = document.toJSON()
          @id = attributes.id
          @title = attributes.title
          @content = attributes.content
        .fail =>
          @resetCurrentDocument()

    getCurrentDocumentId: -> @id

    getCurrentDocumentTitle: -> @title or ''

    setCurrentDocumentTitle: (value) ->
      value = null unless value
      @title = value

    getCurrentDocumentContent: -> @content or ''

    setCurrentDocumentContent: (value) ->
      value = null unless value
      @content = value

    isCurrentDocumentNew: -> not @id

    isCurrentDocumentDirty: ->
      return @content if @isCurrentDocumentNew()
      document = @documents.get @id
      @content isnt document.get 'content'

    saveCurrentDocument: (callback) ->
      attributes = content: @content

      if @isCurrentDocumentNew()
        attributes.title = @title
        @documents.create attributes,
          wait: true
          success: (doc) =>
            @id = doc.id
            callback()
      else
        document = @documents.get @id
        document.save attributes, success: -> callback()

    getNewDocumentTitle: ->
      title = @title
      unless title
        count = @documents.length + 1
        title = "New document #{count}"
      title