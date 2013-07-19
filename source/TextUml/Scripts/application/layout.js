
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
        dock: 'left',
        accessKey: 'L',
        cookie: 'aside'
      }).on('toggleDock resize', function() {
        return _(function() {
          return $(window).trigger('resize');
        }).defer();
      });
      $('#main').splitter({
        type: 'v',
        outline: true,
        anchorToWindow: true,
        accessKey: 'M',
        cookie: 'main'
      });
      return $('#editor-container').splitter({
        type: 'h',
        anchorToWindow: true,
        outline: true,
        accessKey: 'B',
        cookie: 'output'
      });
    }
  };
});
