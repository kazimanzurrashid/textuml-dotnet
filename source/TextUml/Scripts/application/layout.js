
define(function(require) {
  var $, _;
  $ = require('jquery');
  _ = require('underscore');
  require('jquery.splitter');
  return {
    init: function() {
      $('#content').splitter({
        type: 'v',
        outline: true,
        anchorToWindow: true,
        minLeft: 100,
        sizeLeft: 183,
        dock: 'left',
        accessKey: 'L',
        cookie: 'side-bar'
      }).on('toggleDock resize', function() {
        return _(function() {
          return $(window).trigger('resize');
        }).defer();
      });
      return $('#main').splitter({
        type: 'v',
        outline: true,
        anchorToWindow: true,
        minLeft: 200,
        sizeLeft: 291,
        accessKey: 'M',
        cookie: 'main-content'
      });
    }
  };
});
