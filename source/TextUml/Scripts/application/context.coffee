define (require) ->
  Documents = require './models/documents'

  class Context
    documentsType: Documents

    constructor: (options) ->
      @resetCurrentDocument()
      @documents = new @documentsType
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
      @id         = null
      @title      = null
      @content    = null
      @owned      = true
      @shared     = false
      @editable   = true

    setCurrentDocument: (id, callback) ->
      @documents.fetchOne id,
        success: (document) =>
          attributes  = document.toJSON()
          @id         = attributes.id
          @title      = attributes.title
          @content    = attributes.content
          @owned      = attributes.owned
          @shared     = attributes.shared
          @editable   = attributes.editable
          callback? document
        error: =>
          @resetCurrentDocument()
          callback?()

    getCurrentDocumentId: -> @id

    getCurrentDocumentTitle: -> @title or ''

    setCurrentDocumentTitle: (value) ->
      return false unless @isCurrentDocumentEditable()
      value = null unless value
      @title = value

    getCurrentDocumentContent: -> @content or ''

    setCurrentDocumentContent: (value) ->
      return false unless @isCurrentDocumentEditable()
      value = null unless value
      @content = value

    isCurrentDocumentNew: -> not @id

    isCurrentDocumentEditable: -> @editable

    isCurrentDocumentOwned: -> @owned

    isCurrentDocumentShared: -> @shared

    canShareCurrentDocumentUpdate: ->
      @isCurrentDocumentShared() and @isCurrentDocumentEditable()

    saveCurrentDocument: (callback) ->
      return false unless @isCurrentDocumentEditable()

      attributes = content: @content

      if @isCurrentDocumentNew()
        attributes.title = @title
        @documents.create attributes,
          wait: true
          success: (doc) =>
            @id = doc.id
            callback?()
      else
        document = @documents.get @id
        document.save attributes,
          success: -> callback?()

    getNewDocumentTitle: ->
      title = @title
      unless title
        count = @documents.length + 1
        title = "New document #{count}"
      title