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
        var fragment;
        fragment = Backbone.history.fragment;
        if (_this.localHistory.length && _this.localHistory[_this.localHistory.length - 1] === fragment) {
          return false;
        }
        return _this.localHistory.push(fragment);
      });
    }

    Router.prototype.initialize = function(options) {
      this.context = options.context;
      return this.clientUrl = options.clientUrl;
    };

    Router.prototype.newDocument = function() {
      this.context.resetCurrentDocument();
      return events.trigger('documentChanged');
    };

    Router.prototype.openDocument = function(id) {
      var _this = this;
      return this.ensureSignedIn(function() {
        return _this.context.setCurrentDocument(id, function(document) {
          if (!document) {
            $.showErrorbar(("Document with id <strong>" + id + "</strong> ") + 'does not exist.');
            _this.redirecToPrevious();
          }
          return events.trigger('documentChanged');
        });
      });
    };

    Router.prototype.openDocuments = function() {
      var _this = this;
      return this.ensureSignedIn(function() {
        _this.context.resetCurrentDocument();
        events.trigger('documentChanged');
        return events.trigger('showDocuments', {
          cancel: function() {
            return _this.redirectToPrevious();
          }
        });
      });
    };

    Router.prototype.ensureSignedIn = function(action) {
      var _this = this;
      if (!this.context.isUserSignedIn()) {
        return events.trigger('showMembership', {
          ok: function() {
            if (_this.context.isUserSignedIn()) {
              return action();
            } else {
              return _this.redirectToPrevious();
            }
          },
          cancel: function() {
            return _this.redirectToPrevious();
          }
        });
      }
      return action();
    };

    Router.prototype.redirectToPrevious = function() {
      var path;
      if (this.localHistory.length > 1) {
        path = this.localHistory[this.localHistory.length - 2];
      } else {
        path = this.clientUrl('documents', 'new');
      }
      return this.navigate(path, true);
    };

    return Router;

  })(Backbone.Router);
});
