
define(function(require) {
  var Message, Participant;
  Participant = require('../../../../../application/uml/models/sequence/participant');
  Message = require('../../../../../application/uml/language/sequence/message');
  return describe('uml/language/sequence/message', function() {
    var context, handler, spiedAddMessage;
    context = null;
    spiedAddMessage = null;
    handler = null;
    beforeEach(function() {
      handler = new Message;
      context = {
        line: '',
        addMessage: function(sender, receiver, name, async, callReturn) {},
        findOrCreateParticipant: function(identifier) {}
      };
      return spiedAddMessage = sinon.spy(context, 'addMessage');
    });
    return describe('#handles', function() {
      var receiver, result, sender;
      sender = null;
      receiver = null;
      result = null;
      describe('A -> B: Test', function() {
        beforeEach(function() {
          var stubbedFindOrCreate;
          sender = new Participant;
          receiver = new Participant;
          stubbedFindOrCreate = sinon.stub(context, 'findOrCreateParticipant');
          stubbedFindOrCreate.withArgs('A').returns(sender);
          stubbedFindOrCreate.withArgs('B').returns(receiver);
          context.line = 'A -> B: Test';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds message to context', function() {
          return expect(spiedAddMessage).to.have.been.calledWith(sender, receiver, 'Test', false, false);
        });
      });
      describe('A <-- B: Test result', function() {
        beforeEach(function() {
          var stubbedFindOrCreate;
          sender = new Participant;
          receiver = new Participant;
          stubbedFindOrCreate = sinon.stub(context, 'findOrCreateParticipant');
          stubbedFindOrCreate.withArgs('A').returns(receiver);
          stubbedFindOrCreate.withArgs('B').returns(sender);
          context.line = 'A <-- B: Test result';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds message to context', function() {
          return expect(spiedAddMessage).to.have.been.calledWith(sender, receiver, 'Test result', false, true);
        });
      });
      describe('A ->> B: Test', function() {
        beforeEach(function() {
          var stubbedFindOrCreate;
          sender = new Participant;
          receiver = new Participant;
          stubbedFindOrCreate = sinon.stub(context, 'findOrCreateParticipant');
          stubbedFindOrCreate.withArgs('A').returns(sender);
          stubbedFindOrCreate.withArgs('B').returns(receiver);
          context.line = 'A ->> B: Test';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds message to context', function() {
          return expect(spiedAddMessage).to.have.been.calledWith(sender, receiver, 'Test', true, false);
        });
      });
      describe('A <<--- B: Test result', function() {
        beforeEach(function() {
          var stubbedFindOrCreate;
          sender = new Participant;
          receiver = new Participant;
          stubbedFindOrCreate = sinon.stub(context, 'findOrCreateParticipant');
          stubbedFindOrCreate.withArgs('A').returns(receiver);
          stubbedFindOrCreate.withArgs('B').returns(sender);
          context.line = 'A <<-- B: Test result';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds message to context', function() {
          return expect(spiedAddMessage).to.have.been.calledWith(sender, receiver, 'Test result', true, true);
        });
      });
      return describe('invalid', function() {
        beforeEach(function() {
          context = {
            line: 'This is an invalid message'
          };
          return result = handler.handles(context);
        });
        return it('does not handle', function() {
          return expect(result).to.not.be.ok;
        });
      });
    });
  });
});
