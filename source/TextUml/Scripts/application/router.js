var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Router, events, _;

  $ = require('jquery');
  _ = require('underscore');
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
      this.navigationHistory = [];
      this.on('all', function() {
        var path;

        path = Backbone.history.fragment;
        if (_this.navigationHistory.length && _(_this.navigationHistory).last() === path) {
          return false;
        }
        return _this.navigationHistory.push(path);
      });
    }

    Router.prototype.initialize = function(options) {
      this.context = options.context;
      return this.defaultUrl = options.defaultUrl;
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

      if (this.navigationHistory.length > 1) {
        path = this.navigationHistory[this.navigationHistory.length - 2];
      } else {
        path = this.defaultUrl;
      }
      return this.navigate(path, true);
    };

    return Router;

  })(Backbone.Router);
});
