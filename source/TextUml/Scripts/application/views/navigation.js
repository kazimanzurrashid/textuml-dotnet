var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, NavigationView, events;
  $ = require('jquery');
  Backbone = require('backbone');
  events = require('../events');
  return NavigationView = (function(_super) {

    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.el = '#navigation';

    NavigationView.prototype.events = {
      'click [data-command]': 'handleCommand'
    };

    NavigationView.prototype.handleCommand = function(e) {
      var command;
      command = $(e.currentTarget).attr('data-command');
      if (!command) {
        return false;
      }
      return events.trigger(command);
    };

    return NavigationView;

  })(Backbone.View);
});
