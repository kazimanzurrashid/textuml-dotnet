define('jquery', function() {
  return jQuery;
});

require.config({
  baseUrl: '/Scripts',
  paths: {
    'jquery.migrate': './jquery-migrate-1.1.1',
    'jquery.cookie': './jquery.cookie',
    'jquery.splitter': './jquery.splitter',
    bootstrap: './bootstrap',
    underscore: './underscore',
    backbone: './backbone',
    kinetic: './kinetic-v4.4.3',
    moment: './moment',
    codemirror: './codemirror/codemirror',
    codemirrormarkselection: './codemirror/addon/selection/active-line',
    codemirroractiveline: './codemirror/addon/selection/mark-selection',
    signalr: './jquery.signalR-1.1.2',
    confirm: 'application/lib/confirm',
    flashbar: 'application/lib/flashbar',
    form: 'application/lib/form'
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
    signalr: ['jquery'],
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
