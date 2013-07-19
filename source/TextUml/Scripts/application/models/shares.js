var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Share, Shares, _ref;

  Backbone = require('backbone');
  Share = require('./share');
  return Shares = (function(_super) {
    __extends(Shares, _super);

    function Shares() {
      _ref = Shares.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Shares.prototype.model = Share;

    Shares.prototype.url = function() {
      return "/api/documents/" + this.documentId + "/shares";
    };

    Shares.prototype.update = function(options) {
      return Backbone.sync('update', this, options);
    };

    return Shares;

  })(Backbone.Collection);
});
