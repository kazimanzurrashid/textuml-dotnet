define (require) ->
  $                         = require 'jquery'
  Backbone                  = require 'backbone'
  toastr                    = require 'toastr'
  NavigationView            = require './views/navigation'
  ExampleListView           = require './views/examplelist'
  EditorView                = require './views/editor'
  CanvasView                = require './views/canvas'
  MembershipView            = require './views/membership'
  ProfileView               = require './views/profile'
  DocumentTitleView         = require './views/documenttitle'
  DocumentBrowserView       = require './views/documentbrowser'
  ExportedDocumentView      = require './views/exporteddocument'
  ShareDocumentView         = require './views/sharedocument'
  Context                   = require './context'
  Router                    = require './router'
  Sharing                   = require './sharing'
  events                    = require './events'
  layout                    = require './layout'
  require 'flashbar'

  clientUrlPrefix = '#!/'

  clientUrl = (segments...) ->
    path = segments.join '/'
    path = path.substring(1) if path.length and path.indexOf('/') is 0
    clientUrlPrefix + path

  hasClientUrl = ->
    hash = window.location.hash
    return true if hash.length > clientUrlPrefix.length
    return false if clientUrlPrefix.indexOf(hash) is 0
    true

  sharing   = null
  context   = null
  router    = null

  attachEventHandlers = ->
    events.on 'saveDocument', ->
      unless context.isUserSignedIn()
        return events.trigger 'showMembership'
      if context.isCurrentDocumentNew()
        return events.trigger 'showNewDocumentTitle'
      context.saveCurrentDocument ->
        $.showInfobar 'Your document is successfully saved.'

    events.on 'newDocumentTitleAssigned', ->
      context.saveCurrentDocument ->
        $.showInfobar 'Your document is successfully saved.'
        url = clientUrl 'documents', context.getCurrentDocumentId()
        router.navigate url

    events.on 'documentSelected', (e) ->
      router.navigate clientUrl('documents', e.id), true

    events.on 'myAccount', ->
      eventName = if context.isUserSignedIn()
          'showProfile'
        else
          'showMembership'
      events.trigger eventName

    events.on 'signedIn', ->
      sharing.start()
      context.userSignedIn()
      $.showInfobar 'You are now signed in.'

    events.on 'passwordResetTokenRequested', ->
      $.showInfobar 'An email with a password reset link has been sent to ' +
        'your email address. Please open the link to reset your password.'

    events.on 'passwordChanged', ->
      $.showInfobar 'You have changed your password successfully.'

    events.on 'signedUp', ->
      $.showInfobar 'Thank you for signing up, an email with a confirmation ' +
        'link has been sent to your email address. Please open the link ' +
        'to activate your account.'

    events.on 'signedOut', ->
      sharing.stop()
      context.userSignedOut()
      router.navigate clientUrl('documents', 'new'), true
      $.showInfobar 'You are now signed out.'

  createViews = ->
    app.views =
      navigation          : new NavigationView
      exampleList         : new ExampleListView
      editor              : new EditorView { context }
      canvas              : new CanvasView { context }
      membership          : new MembershipView
      profile             : new ProfileView
      documentTitle       : new DocumentTitleView { context }
      documentBrowser     : new DocumentBrowserView { context }
      exportedDocument    : new ExportedDocumentView
      shareDocumentView   : new ShareDocumentView { context }

  app =
    clientUrl: clientUrl

    start: (options) ->
      toastr.options = positionClass: 'toast-bottom-right'
      layout.init()

      context = new Context options
      sharing = new Sharing { context }
      router = new Router { context, clientUrl }

      app.context = context
      app.sharing = sharing
      app.router = router

      sharing.on 'userJoined', (e) ->
        return false unless e.documentId is context.getCurrentDocumentId()
        toastr.info "#{e.user} has joined."

      sharing.on 'documentUpdated', (e) ->
        return false unless e.documentId is context.getCurrentDocumentId()
        toastr.info "#{e.user} has updated the code."
        events.trigger 'documentContentChanged', code: e.content

      sharing.on 'userLeft', (e) ->
        return false unless e.documentId is context.getCurrentDocumentId()
        toastr.info "#{e.user} has left."

      sharing.start() if options.userSignedIn
      attachEventHandlers()
      createViews()

      Backbone.history.start()

      $(window).on 'beforeunload', ->
        if context.isCurrentDocumentDirty()
          return 'Your document has unsaved changes, if you navigate ' +
            'away your changes will be lost.'

      return true if hasClientUrl()
      router.navigate clientUrl('documents', 'new'), true

  window.app = app
  app