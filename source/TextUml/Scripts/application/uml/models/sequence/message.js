var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var Base, Message;
  Base = require('./base');
  return Message = (function(_super) {

    __extends(Message, _super);

    function Message(sender, receiver, name, async, callReturn, parent) {
      this.sender = sender;
      this.receiver = receiver;
      this.name = name;
      this.async = async;
      this.callReturn = callReturn;
      Message.__super__.constructor.call(this, parent);
    }

    Message.prototype.selfInvoking = function() {
      return this.sender === this.receiver;
    };

    return Message;

  })(Base);
});
