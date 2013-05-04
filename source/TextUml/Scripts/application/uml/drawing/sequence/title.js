var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Composite, Config, Title, attrs;

  Config = require('./config');
  Composite = require('./composite');
  attrs = {
    fontFamily: Config.fontFamily,
    fontSize: Config.fontSize * 1.5,
    fill: Config.foreColor
  };
  return Title = (function(_super) {
    __extends(Title, _super);

    function Title(model) {
      this.model = model;
      Title.__super__.constructor.apply(this, arguments);
    }

    Title.prototype.draw = function(context) {
      var point, text;

      point = context.getTitleShapeStartPoint(this.model.text, attrs);
      text = context.shapeFactory.text(point.x, point.y, this.model.text, attrs).draw(context.surface);
      this.children.push(text);
      context.addShape(this);
      return this;
    };

    return Title;

  })(Composite);
});
