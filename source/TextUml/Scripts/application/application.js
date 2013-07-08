var __slice = [].slice;

define(function(require) {
  var $, Backbone, CanvasView, Context, DocumentBrowserView, DocumentTitleView, EditorView, ExampleListView, ExportedDocumentView, MembershipView, NavigationView, ProfileView, Router, ShareDocumentView, Sharing, app, attachEventHandlers, clientUrl, clientUrlPrefix, context, createViews, events, hasClientUrl, layout, router, sharing;
  $ = require('jquery');
  Backbone = require('backbone');
  NavigationView = require('./views/navigation');
  ExampleListView = require('./views/examplelist');
  EditorView = require('./views/editor');
  CanvasView = require('./views/canvas');
  MembershipView = require('./views/membership');
  ProfileView = require('./views/profile');
  DocumentTitleView = require('./views/documenttitle');
  DocumentBrowserView = require('./views/documentbrowser');
  ExportedDocumentView = require('./views/exporteddocument');
  ShareDocumentView = require('./views/sharedocument');
  Context = require('./context');
  Router = require('./router');
  Sharing = require('./sharing');
  events = require('./events');
  layout = require('./layout');
  require('flashbar');
  clientUrlPrefix = '#!/';
  clientUrl = function() {
    var path, segments;
    segments = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    path = segments.join('/');
    if (path.length && path.indexOf('/') === 0) {
      path = path.substring(1);
    }
    return clientUrlPrefix + path;
  };
  hasClientUrl = function() {
    var hash;
    hash = window.location.hash;
    if (hash.length > clientUrlPrefix.length) {
      return true;
    }
    if (clientUrlPrefix.indexOf(hash) === 0) {
      return false;
    }
    return true;
  };
  sharing = null;
  context = null;
  router = null;
  attachEventHandlers = function() {
    events.on('saveDocument', function() {
      if (!context.isUserSignedIn()) {
        return events.trigger('showMembership');
      }
      if (context.isCurrentDocumentNew()) {
        return events.trigger('showNewDocumentTitle');
      }
      return context.saveCurrentDocument(function() {
        return $.showInfobar('Your document is successfully saved.');
      });
    });
    events.on('newDocumentTitleAssigned', function() {
      return context.saveCurrentDocument(function() {
        var url;
        $.showInfobar('Your document is successfully saved.');
        url = clientUrl('documents', context.getCurrentDocumentId());
        return router.navigate(url);
      });
    });
    events.on('documentSelected', function(e) {
      return router.navigate(clientUrl('documents', e.id), true);
    });
    events.on('myAccount', function() {
      var eventName;
      eventName = context.isUserSignedIn() ? 'showProfile' : 'showMembership';
      return events.trigger(eventName);
    });
    events.on('signedIn', function() {
      sharing.start();
      context.userSignedIn();
      return $.showInfobar('You are now signed in.');
    });
    events.on('passwordResetTokenRequested', function() {
      return $.showInfobar('An email with a password reset link has been sent to ' + 'your email address. Please open the link to reset your password.');
    });
    events.on('passwordChanged', function() {
      return $.showInfobar('You have changed your password successfully.');
    });
    events.on('signedUp', function() {
      return $.showInfobar('Thank you for signing up, an email with a confirmation ' + 'link has been sent to your email address. Please open the link ' + 'to activate your account.');
    });
    return events.on('signedOut', function() {
      sharing.stop();
      context.userSignedOut();
      router.navigate(clientUrl('documents', 'new'), true);
      return $.showInfobar('You are now signed out.');
    });
  };
  createViews = function() {
    return app.views = {
      navigation: new NavigationView,
      exampleList: new ExampleListView,
      editor: new EditorView({
        context: context
      }),
      canvas: new CanvasView({
        context: context
      }),
      membership: new MembershipView,
      profile: new ProfileView,
      documentTitle: new DocumentTitleView({
        context: context
      }),
      documentBrowser: new DocumentBrowserView({
        context: context
      }),
      exportedDocument: new ExportedDocumentView,
      shareDocumentView: new ShareDocumentView({
        context: context
      })
    };
  };
  app = {
    clientUrl: clientUrl,
    start: function(options) {
      layout.init();
      app.context = context = new Context(options);
      app.sharing = sharing = new Sharing({
        context: context
      });
      if (options.userSignedIn) {
        sharing.start();
      }
      attachEventHandlers();
      createViews();
      app.router = router = new Router({
        context: context,
        clientUrl: clientUrl
      });
      Backbone.history.start();
      $(window).on('beforeunload', function() {
        if (context.isCurrentDocumentDirty()) {
          return 'Your document has unsaved changes, if you navigate ' + 'away your changes will be lost.';
        }
      });
      if (hasClientUrl()) {
        return true;
      }
      return router.navigate(clientUrl('documents', 'new'), true);
    }
  };
  window.app = app;
  return app;
});
