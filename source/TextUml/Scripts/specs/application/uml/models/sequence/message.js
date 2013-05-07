
define(function(require) {
  var Message, Participant;
  Participant = require('../../../../../application/uml/models/sequence/participant');
  Message = require('../../../../../application/uml/models/sequence/message');
  return describe('uml/models/sequence/message', function() {
    var message;
    message = null;
    return describe('#selfInvoking', function() {
      describe('same sender and receiver', function() {
        beforeEach(function() {
          var participant;
          participant = new Participant;
          return message = new Message(participant, participant);
        });
        return it('returns true', function() {
          return expect(message.selfInvoking()).to.be.ok;
        });
      });
      return describe('different sender and receiver', function() {
        beforeEach(function() {
          var receiver, sender;
          sender = new Participant;
          receiver = new Participant;
          return message = new Message(sender, receiver);
        });
        return it('returns false', function() {
          return expect(message.selfInvoking()).to.not.be.ok;
        });
      });
    });
  });
});
