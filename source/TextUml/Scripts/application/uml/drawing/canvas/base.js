define(function() {
  var Base;

  return Base = (function() {
    function Base(attributes) {
      this.attributes = attributes != null ? attributes : {};
    }

    Base.prototype.draw = function(surface) {
      throw new Error('Not implemented.');
    };

    Base.prototype.remove = function() {
      this.element.destroy();
      return this;
    };

    Base.prototype.getX1 = function() {
      return this.element.getX();
    };

    Base.prototype.getY1 = function() {
      return this.element.getY();
    };

    Base.prototype.getX2 = function() {
      var x2;

      x2 = this.getX1() + this.getWidth();
      return x2;
    };

    Base.prototype.getY2 = function() {
      var y2;

      y2 = this.getY1() + this.getHeight();
      return y2;
    };

    Base.prototype.getWidth = function() {
      return this.element.getWidth();
    };

    Base.prototype.getHeight = function() {
      return this.element.getHeight();
    };

    Base.prototype.show = function() {
      this.element.show();
      return this;
    };

    Base.prototype.hide = function() {
      this.element.hide();
      return this;
    };

    Base.prototype.toBack = function() {
      this.element.moveToBottom();
      return this;
    };

    Base.prototype.toFront = function() {
      this.element.moveToTop();
      return this;
    };

    return Base;

  })();
});
