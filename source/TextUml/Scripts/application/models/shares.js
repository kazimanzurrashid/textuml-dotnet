var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Share, Shares, _;
  _ = require('underscore');
  Backbone = require('backbone');
  Share = require('./share');
  return Shares = (function(_super) {

    __extends(Shares, _super);

    function Shares() {
      return Shares.__super__.constructor.apply(this, arguments);
    }

    Shares.prototype.model = Share;

    Shares.prototype.url = function() {
      return "/api/documents/" + this.documentId + "/shares";
    };

    Shares.prototype.update = function(options) {
      return Backbone.sync('update', this, options);
    };

    Shares.collections = {};

    Shares.get = function(documentId, callback) {
      var collection;
      collection = Shares.collections[documentId];
      if (collection != null ? collection.length : void 0) {
        return _(function() {
          return callback(collection);
        }).defer();
      }
      collection = new Shares;
      Shares.set(documentId, collection);
      return collection.fetch({
        success: function() {
          return callback(collection);
        },
        error: function() {
          return callback(collection);
        }
      });
    };

    Shares.set = function(documentId, collection) {
      collection.documentId = documentId;
      return Shares.collections[documentId] = collection;
    };

    Shares.remove = function(documentId) {
      return delete Shares.collections[documentId];
    };

    Shares.reset = function() {
      return Shares.collections = {};
    };

    return Shares;

  })(Backbone.Collection);
});
