var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Example, ExampleListView, Examples, events, generateData, _, _ref;

  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  Example = require('../models/example');
  Examples = require('../models/examples');
  events = require('../events');
  generateData = function() {
    return new Examples([
      new Example({
        display: 'Sync call',
        snippet: 'A -> B: Sync message'
      }), new Example({
        display: 'Sync return',
        snippet: 'A <-- B: Sync message return'
      }), new Example({
        display: 'Async call',
        snippet: 'A ->> B: Async message'
      }), new Example({
        display: 'Async return',
        snippet: 'A <<-- B: Async message return'
      }), new Example({
        display: 'Loop',
        snippet: 'loop n times\n  \' nested calls goes here...\nend'
      }), new Example({
        display: 'If',
        snippet: 'opt condition\n  \' nested calls goes here...\nend'
      }), new Example({
        display: 'If/Else',
        snippet: 'alt condition 1\n  \' nested calls goes here...\nelse ' + 'condition 2\n  \' nested calls goes here...\nend'
      })
    ]);
  };
  return ExampleListView = (function(_super) {
    __extends(ExampleListView, _super);

    function ExampleListView() {
      _ref = ExampleListView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ExampleListView.prototype.el = '#example-list';

    ExampleListView.prototype.events = {
      'click li': 'select'
    };

    ExampleListView.prototype.initialize = function() {
      this.template = _('<li>{{display}}</li>').template();
      this.collection = generateData();
      return this.render();
    };

    ExampleListView.prototype.render = function() {
      var _this = this;

      this.$el.empty();
      this.collection.each(function(example) {
        return _this.$el.append($(_this.template(example.toJSON())).attr('data-cid', example.cid));
      });
      return this;
    };

    ExampleListView.prototype.select = function(e) {
      var cid, example;

      cid = $(e.currentTarget).attr('data-cid');
      example = this.collection.get(cid);
      return events.trigger('exampleSelected', {
        example: example
      });
    };

    return ExampleListView;

  })(Backbone.View);
});
