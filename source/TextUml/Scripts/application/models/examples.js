var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Backbone, Example, Examples;
  Backbone = require('backbone');
  Example = require('./example');
  return Examples = (function(_super) {

    __extends(Examples, _super);

    function Examples() {
      return Examples.__super__.constructor.apply(this, arguments);
    }

    Examples.prototype.model = Example;

    return Examples;

  })(Backbone.Collection);
});
