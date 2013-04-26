(function() {
  define('jquery', [], function() {
    return jQuery;
  });

  require.config({
    baseUrl: '/Scripts/application',
    paths: {
      'jquery.migrate': '../jquery-migrate-1.1.1',
      bootstrap: '../bootstrap',
      'jquery.cookie': '../jquery.cookie',
      'jquery.splitter': '../jquery.splitter',
      underscore: '../underscore',
      backbone: '../backbone',
      kinetic: '../kinetic-v4.4.3',
      moment: '../moment',
      codemirror: '../codemirror/codemirror',
      codemirrormarkselection: '../codemirror/addon/selection/active-line',
      codemirroractiveline: '../codemirror/addon/selection/mark-selection',
      confirm: 'lib/confirm',
      flashbar: 'lib/flashbar',
      form: 'lib/form'
    },
    shim: {
      jquery: {
        exports: '$',
        init: function() {
          return this.$.noConflict();
        }
      },
      'jquery.migrate': ['jquery'],
      'jquery.cookie': ['jquery', 'jquery.migrate'],
      'jquery.splitter': ['jquery', 'jquery.migrate', 'jquery.cookie'],
      bootstrap: ['jquery'],
      signalr: ['jquery'],
      hub: ['jquery', 'signalr'],
      underscore: {
        exports: '_',
        init: function() {
          this._.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
          };
          return this._;
        }
      },
      backbone: {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
      },
      codemirror: {
        exports: 'CodeMirror'
      },
      codemirrormarkselection: ['codemirror'],
      codemirroractiveline: ['codemirror']
    }
  });

  define(function(require) {
    var $, app, options;

    $ = require('jquery');
    app = require('application');
    options = require('preloaded-data');
    return $(function() {
      return app.start(options);
    });
  });

}).call(this);
