var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function(require) {
  var $, BROADCAST_DELAY, Backbone, Sharing, events, proxy, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  events = require('./events');
  require('signalr');
  require('noext!/signalr/hubs');
  proxy = $.connection.sharingHub;
  BROADCAST_DELAY = 1000 * 3;
  return Sharing = (function() {

    function Sharing(options) {
      this.onBroadcast = __bind(this.onBroadcast, this);

      this.onDocumentChanged = __bind(this.onDocumentChanged, this);

      this.onUnsubscribed = __bind(this.onUnsubscribed, this);

      this.onUpdated = __bind(this.onUpdated, this);

      this.onSubscribed = __bind(this.onSubscribed, this);
      _(this).extend(Backbone.Events);
      this.context = options.context;
      proxy.client.subscribed = this.onSubscribed;
      proxy.client.updated = this.onUpdated;
      proxy.client.unsubscribed = this.onUnsubscribed;
    }

    Sharing.prototype.start = function() {
      var _this = this;
      return $.connection.hub.start().done(function() {
        events.on('documentChanged', _this.onDocumentChanged);
        return events.on('broadcastDocumentContentChange', _(_this.onBroadcast).debounce(BROADCAST_DELAY));
      });
    };

    Sharing.prototype.stop = function() {
      events.off('documentChanged');
      return events.off('broadcastDocumentContentChange');
    };

    Sharing.prototype.onSubscribed = function(documentId, user) {
      return this.trigger('userJoined', {
        documentId: parseInt(documentId, 10),
        user: user
      });
    };

    Sharing.prototype.onUpdated = function(documentId, content, user) {
      return this.trigger('documentUpdated', {
        documentId: parseInt(documentId, 10),
        content: content,
        user: user
      });
    };

    Sharing.prototype.onUnsubscribed = function(documentId, user) {
      return this.trigger('userLeft', {
        documentId: parseInt(documentId, 10),
        user: user
      });
    };

    Sharing.prototype.onDocumentChanged = function() {
      var id,
        _this = this;
      id = this.documentId;
      if (id) {
        proxy.server.unsubscribe(id).done(function() {
          return _this.documentId = void 0;
        });
      }
      if (this.context.isCurrentDocumentShared()) {
        id = this.context.getCurrentDocumentId();
        return proxy.server.subscribe(id).done(function() {
          return _this.documentId = id;
        });
      }
    };

    Sharing.prototype.onBroadcast = function(e) {
      if (!this.context.canShareCurrentDocumentUpdate()) {
        return false;
      }
      return proxy.server.update(this.context.getCurrentDocumentId(), e.content);
    };

    return Sharing;

  })();
});
