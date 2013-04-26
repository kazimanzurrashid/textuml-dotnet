var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, Example, ExampleListItemView, ExampleListView, Examples, events, generateData, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  Example = require('../models/example');
  Examples = require('../models/examples');
  ExampleListItemView = require('./exampleitem');
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
      return ExampleListView.__super__.constructor.apply(this, arguments);
    }

    ExampleListView.prototype.el = '#example-list';

    ExampleListView.prototype.events = {
      'click li': 'select'
    };

    ExampleListView.prototype.initialize = function() {
      this.children = [];
      this.template = _('{{display}}').template();
      this.collection = generateData();
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'add', this.renderItem);
      return this.render();
    };

    ExampleListView.prototype.render = function() {
      var _this = this;
      this.removeChildren();
      this.collection.each(function(example) {
        return _this.renderItem(example, false);
      });
      return this;
    };

    ExampleListView.prototype.renderItem = function(example, animate) {
      var child,
        _this = this;
      if (animate == null) {
        animate = true;
      }
      child = new ExampleListItemView({
        model: example,
        template: this.template
      });
      this.listenTo(child, 'removing', function() {
        var index;
        index = _(_this.children).indexOf(child);
        _this.stopListening(child, 'removing');
        return _this.children.splice(index, 1);
      });
      child.render().$el.data('id', example.cid).appendTo(this.$el);
      if (animate) {
        child.$el.hide().fadeIn();
      }
      return this.children.push(child);
    };

    ExampleListView.prototype.remove = function() {
      this.removeChildren();
      return ExampleListView.__super__.remove.apply(this, arguments);
    };

    ExampleListView.prototype.removeChildren = function() {
      var child, _results;
      _results = [];
      while (child = this.children.pop()) {
        this.stopListening(child, 'removing');
        _results.push(child.remove(false));
      }
      return _results;
    };

    ExampleListView.prototype.select = function(e) {
      var cid, example;
      cid = $(e.currentTarget).data('id');
      example = this.collection.get(cid);
      return events.trigger('exampleSelected', {
        example: example
      });
    };

    return ExampleListView;

  })(Backbone.View);
});
