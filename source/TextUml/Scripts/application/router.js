var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Router, events;
  $ = require('jquery');
  Backbone = require('backbone');
  events = require('./events');
  require('flashbar');
  require('confirm');
  return Router = (function(_super) {

    __extends(Router, _super);

    Router.prototype.routes = {
      '!/documents/new': 'newDocument',
      '!/documents/:id': 'openDocument',
      '!/documents': 'openDocuments'
    };

    function Router() {
      var _this = this;
      Router.__super__.constructor.apply(this, arguments);
      this.localHistory = [];
      this.on('all', function() {
        var path;
        path = Backbone.history.fragment;
        if (_this.localHistory.length && _this.localHistory[_this.localHistory.length - 1] === path) {
          return false;
        }
        return _this.localHistory.push(path);
      });
    }

    Router.prototype.initialize = function(options) {
      this.context = options.context;
      return this.clientUrl = options.clientUrl;
    };

    Router.prototype.newDocument = function() {
      var _this = this;
      return this.promptForUnsavedChanges(function() {
        _this.context.resetCurrentDocument();
        return events.trigger('documentChanged');
      });
    };

    Router.prototype.openDocument = function(id) {
      var action,
        _this = this;
      action = function() {
        return _this.context.setCurrentDocument(id, function(document) {
          if (!document) {
            $.showErrorbar(("Document with id <strong>" + id + "</strong> ") + 'does not exist.');
            _this.previous();
          }
          return events.trigger('documentChanged');
        });
      };
      return this.promptForUnsavedChanges(function() {
        if (!_this.context.isUserSignedIn()) {
          return events.trigger('showMembership', {
            ok: function() {
              return action();
            },
            cancel: function() {
              return _this.previous();
            }
          });
        }
        return action();
      });
    };

    Router.prototype.openDocuments = function() {
      var action,
        _this = this;
      action = function() {
        _this.context.resetCurrentDocument();
        events.trigger('documentChanged');
        return events.trigger('showDocuments', {
          cancel: function() {
            return _this.previous();
          }
        });
      };
      return this.promptForUnsavedChanges(function() {
        if (!_this.context.isUserSignedIn()) {
          return events.trigger('showMembership', {
            ok: function() {
              return action();
            },
            cancel: function() {
              return _this.previous();
            }
          });
        }
        return action();
      });
    };

    Router.prototype.promptForUnsavedChanges = function(callback) {
      var _this = this;
      if (this.implicitRedirect) {
        return false;
      }
      if (!this.context.isCurrentDocumentDirty()) {
        callback();
        return false;
      }
      $.confirm({
        prompt: 'Your document has unsaved changes, if you navigate away ' + 'your changes will be lost. Click OK to continue, or Cancel to ' + 'stay on the current page.',
        ok: function() {
          return callback();
        },
        cancel: function() {
          return _this.previous();
        }
      });
      return true;
    };

    Router.prototype.previous = function() {
      var path;
      if (this.localHistory.length > 1) {
        path = this.localHistory[this.localHistory.length - 2];
      } else {
        path = this.clientUrl('documents', 'new');
      }
      this.implicitRedirect = true;
      this.navigate(path);
      return this.implicitRedirect = false;
    };

    return Router;

  })(Backbone.Router);
});
