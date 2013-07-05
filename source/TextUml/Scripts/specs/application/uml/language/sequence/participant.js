
define(function(require) {
  var Participant;
  Participant = require('../../../../../application/uml/language/sequence/participant');
  return describe('uml/language/sequence/participant', function() {
    var handler;
    handler = null;
    beforeEach(function() {
      return handler = new Participant;
    });
    return describe('#handles', function() {
      var context, result;
      context = null;
      result = null;
      describe('with name and alias', function() {
        var spiedAddParticipant;
        spiedAddParticipant = null;
        beforeEach(function() {
          context = {
            line: 'participant "A very long name" as A',
            findParticipant: function(identifier) {},
            addParticipant: function(name, alias) {}
          };
          spiedAddParticipant = sinon.spy(context, 'addParticipant');
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds participant to context', function() {
          return expect(spiedAddParticipant).to.have.been.calledWith('A very long name', 'A');
        });
      });
      describe('only name', function() {
        var spiedAddParticipant;
        spiedAddParticipant = null;
        beforeEach(function() {
          context = {
            line: 'participant A',
            findParticipant: function(identifier) {},
            addParticipant: function(name, alias) {}
          };
          spiedAddParticipant = sinon.spy(context, 'addParticipant');
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds participant to context', function() {
          return expect(spiedAddParticipant).to.have.been.calledWith('A', void 0);
        });
      });
      describe('duplicate name', function() {
        var stubbedFindParticipant;
        stubbedFindParticipant = null;
        beforeEach(function() {
          context = {
            line: 'participant A',
            getLineNumber: function() {
              return 1;
            },
            findParticipant: function(identifier) {}
          };
          return sinon.stub(context, 'findParticipant', function() {
            return true;
          });
        });
        return it('throws', function() {
          return expect(function() {
            return handler.handles(context);
          }).to["throw"]('Error on line 1, participant with name "A" already exists.');
        });
      });
      return describe('duplicate alias', function() {
        beforeEach(function() {
          var stubbedFindParticipant;
          context = {
            line: 'participant "long name" as A',
            getLineNumber: function() {
              return 1;
            },
            findParticipant: function(identifier) {}
          };
          stubbedFindParticipant = sinon.stub(context, 'findParticipant');
          return stubbedFindParticipant.withArgs('A').returns(true);
        });
        return it('throws', function() {
          return expect(function() {
            return handler.handles(context);
          }).to["throw"]('Error on line 1, participant with alias "A" already exists.');
        });
      });
    });
  });
});
