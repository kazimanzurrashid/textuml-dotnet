
define(function(require) {
  var Backbone, events, _;
  _ = require('underscore');
  Backbone = require('backbone');
  events = {};
  _(events).extend(Backbone.Events);
  return events;
});
