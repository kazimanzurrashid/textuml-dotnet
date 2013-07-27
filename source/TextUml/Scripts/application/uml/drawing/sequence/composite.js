define(function(require) {
  var Composite, _;

  _ = require('underscore');
  return Composite = (function() {
    function Composite() {
      this.children = [];
    }

    Composite.prototype.draw = function(context) {
      throw new Error('Not implemented.');
    };

    Composite.prototype.remove = function() {
      _(this.children).each(function(s) {
        return s.remove();
      });
      return this;
    };

    Composite.prototype.getX1 = function() {
      var x1;

      if (!this.children.length) {
        return 0;
      }
      x1 = _(this.children).chain().map(function(s) {
        return s.getX1();
      }).sortBy(function(v) {
        return v;
      }).first().value();
      return x1;
    };

    Composite.prototype.getY1 = function() {
      var y1;

      if (!this.children.length) {
        return 0;
      }
      y1 = _(this.children).chain().map(function(s) {
        return s.getY1();
      }).sortBy(function(v) {
        return v;
      }).first().value();
      return y1;
    };

    Composite.prototype.getX2 = function() {
      var x2;

      if (!this.children.length) {
        return 0;
      }
      x2 = _(this.children).chain().map(function(s) {
        return s.getX2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      return x2;
    };

    Composite.prototype.getY2 = function() {
      var y2;

      if (!this.children.length) {
        return 0;
      }
      y2 = _(this.children).chain().map(function(s) {
        return s.getY2();
      }).sortBy(function(v) {
        return v;
      }).last().value();
      return y2;
    };

    Composite.prototype.getWidth = function() {
      var width;

      width = this.getX2() - this.getX1();
      return width;
    };

    Composite.prototype.getHeight = function() {
      var height;

      height = this.getY2() - this.getY1();
      return height;
    };

    Composite.prototype.show = function() {
      _(this.children).each(function(s) {
        return s.show();
      });
      return this;
    };

    Composite.prototype.hide = function() {
      _(this.children).each(function(s) {
        return s.hide();
      });
      return this;
    };

    Composite.prototype.toBack = function() {
      _(this.children).each(function(s) {
        return s.toBack();
      });
      return this;
    };

    Composite.prototype.toFront = function() {
      _(this.children).each(function(s) {
        return s.toFront();
      });
      return this;
    };

    return Composite;

  })();
});
