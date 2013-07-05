
define(function() {
  var Base;
  return Base = (function() {

    function Base(parent) {
      this.setParent(parent);
    }

    Base.prototype.setParent = function(parent) {
      var index;
      if (this.parent === parent) {
        return this;
      }
      if (this.parent) {
        index = this.parent.children.indexOf(this);
        if (index >= 0) {
          this.parent.children.splice(index, 1);
        }
      }
      this.parent = parent;
      if (this.parent) {
        this.parent.children.push(this);
      }
      return this;
    };

    return Base;

  })();
});
