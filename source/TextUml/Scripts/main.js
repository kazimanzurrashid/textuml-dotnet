
define(function(require) {
  var $, app, options;
  $ = require('jquery');
  app = require('application/application');
  options = require('preloaded-data');
  require('noext');
  require('signalr');
  return $(function() {
    return app.start(options);
  });
});
