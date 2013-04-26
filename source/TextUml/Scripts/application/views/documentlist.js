var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var $, Backbone, DocumentListItemView, DocumentListView, _;
  $ = require('jquery');
  _ = require('underscore');
  Backbone = require('backbone');
  DocumentListItemView = require('./documentitem');
  return DocumentListView = (function(_super) {

    __extends(DocumentListView, _super);

    function DocumentListView() {
      return DocumentListView.__super__.constructor.apply(this, arguments);
    }

    DocumentListView.prototype.el = '#document-list';

    DocumentListView.prototype.events = function() {
      return {
        'click .btn-toolbar .btn': 'sort',
        'keydown .list-container': 'navigate',
        'scroll .list-container': 'load',
        'click .list-container li': 'select',
        'dblclick .list-container li': 'open'
      };
    };

    DocumentListView.prototype.initialize = function() {
      this.listContainer = this.$('.list-container');
      this.list = this.listContainer.find('> ul');
      this.children = [];
      this.selectedId = void 0;
      this.template = _($('#document-item-template').html()).template();
      this.listenTo(this.collection, 'reset sort', this.render);
      this.listenTo(this.collection, 'add', this.renderItem);
      return this.render();
    };

    DocumentListView.prototype.getSelectedId = function() {
      return this.selectedId;
    };

    DocumentListView.prototype.resetSelection = function() {
      this.list.children().removeClass('active');
      return this.selectedId = void 0;
    };

    DocumentListView.prototype.scrollToTop = function() {
      return this.listContainer.scrollTop(0);
    };

    DocumentListView.prototype.render = function() {
      var _this = this;
      this.removeChildren();
      this.collection.each(function(document) {
        return _this.renderItem(document, false);
      });
      return this;
    };

    DocumentListView.prototype.renderItem = function(document, animate) {
      var child,
        _this = this;
      if (animate == null) {
        animate = true;
      }
      child = new DocumentListItemView({
        model: document,
        template: this.template
      });
      this.listenTo(child, 'removing', function() {
        var index;
        index = _(_this.children).indexOf(child);
        _this.stopListening(child, 'removing');
        return _this.children.splice(index, 1);
      });
      child.render().$el.data('id', document.id).appendTo(this.list);
      if (animate) {
        child.$el.hide().fadeIn();
      }
      return this.children.push(child);
    };

    DocumentListView.prototype.remove = function() {
      this.removeChildren();
      return DocumentListView.__super__.remove.apply(this, arguments);
    };

    DocumentListView.prototype.removeChildren = function() {
      var child, _results;
      _results = [];
      while (child = this.children.pop()) {
        this.stopListening(child, 'removing');
        _results.push(child.remove(false));
      }
      return _results;
    };

    DocumentListView.prototype.sort = function(e) {
      var button, sortAttribute, sortOrder,
        _this = this;
      button = $(e.currentTarget);
      sortAttribute = button.attr('data-sort-attribute');
      sortOrder = button.attr('data-sort-order');
      if (sortAttribute != null) {
        if (sortAttribute === this.collection.sortAttribute) {
          return false;
        }
        this.collection.sortAttribute = sortAttribute;
      } else if (sortOrder != null) {
        if (parseInt(sortOrder, 10) === this.collection.sortOrder) {
          return false;
        }
        this.collection.sortOrder = parseInt(sortOrder, 10);
      }
      this.collection.pageIndex = 0;
      return this.collection.fetch().always(function() {
        return _this.scrollToTop();
      });
    };

    DocumentListView.prototype.load = function() {
      var el;
      if (this.collection.pageIndex >= this.collection.pageCount) {
        return false;
      }
      el = this.listContainer.get(0);
      if (el.scrollTop + el.clientHeight + 125 > el.scrollHeight) {
        this.collection.pageIndex += 1;
        return this.collection.fetch({
          update: true,
          add: true,
          remove: false
        });
      }
    };

    DocumentListView.prototype.navigate = function(e) {
      var index, items, keyCode;
      keyCode = e.which;
      if (keyCode === 38 || keyCode === 40) {
        items = this.list.children('li');
        index = items.index(this.list.find('li.active'));
        if (keyCode === 38) {
          if (!index) {
            return false;
          }
          index -= 1;
        } else if (keyCode === 40) {
          if (index >= items.length - 1) {
            return false;
          }
          index += 1;
        }
        return $(items.get(index)).trigger('click');
      } else if (keyCode === 13 || keyCode === 32) {
        e.preventDefault();
        return this.list.find('li.active').trigger('dblclick');
      }
    };

    DocumentListView.prototype.select = function(e) {
      return this.triggerEvent(e, 'selected');
    };

    DocumentListView.prototype.open = function(e) {
      return this.triggerEvent(e, 'opened');
    };

    DocumentListView.prototype.triggerEvent = function(e, eventName) {
      var element, id;
      e.preventDefault();
      element = $(e.currentTarget);
      id = element.data('id');
      this.resetSelection();
      element.addClass('active');
      this.selectedId = id;
      return this.trigger(eventName);
    };

    return DocumentListView;

  })(Backbone.View);
});
