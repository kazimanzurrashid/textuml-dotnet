
define(function(require) {
  var $, Sharing, events, proxy;
  $ = require('jquery');
  events = require('./events');
  require('signalr');
  require('noext!/signalr/hubs');
  proxy = $.connection.sharingHub;
  proxy.client.subscribed = function(documentId, user) {
    return events.trigger('userJoined', {
      documentId: parseInt(documentId, 10),
      user: user
    });
  };
  proxy.client.updated = function(documentId, content, user) {
    return events.trigger('documentContentChanged', {
      documentId: parseInt(documentId, 10),
      content: content,
      user: user
    });
  };
  proxy.client.unsubscribed = function(documentId, user) {
    return events.trigger('userLeft', {
      documentId: parseInt(documentId, 10),
      user: user
    });
  };
  return Sharing = (function() {

    function Sharing(options) {
      this.context = options.context;
      this.documentId = null;
    }

    Sharing.prototype.start = function() {
      var _this = this;
      return $.connection.hub.start().done(function() {
        return events.on('documentChanged', function(e) {
          var id;
          id = _this.documentId;
          if (id) {
            proxy.server.unsubscribe(id).done(function() {
              return _this.documentId = void 0;
            });
          }
          if (_this.context.isCurrentDocumentShared()) {
            id = _this.context.getCurrentDocumentId();
            return proxy.server.subscribe(id).done(function() {
              return _this.documentId = id;
            });
          }
        });
      });
    };

    Sharing.prototype.stop = function() {
      return events.off('documentChanged');
    };

    return Sharing;

  })();
});
