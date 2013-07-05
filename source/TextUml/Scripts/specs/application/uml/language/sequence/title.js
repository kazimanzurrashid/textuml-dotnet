
define(function(require) {
  var Title;
  Title = require('../../../../../application/uml/language/sequence/title');
  return describe('uml/language/sequence/title', function() {
    var context, handler;
    handler = null;
    context = null;
    beforeEach(function() {
      handler = new Title;
      return context = {
        line: '',
        title: null,
        participants: [],
        commands: [],
        getLineNumber: function() {
          return 2;
        },
        setTitle: function(value) {}
      };
    });
    return describe('#handles', function() {
      var errorMessage, result;
      errorMessage = 'Error on line 2, title must be defined before any other instruction.';
      result = null;
      describe('with valid title', function() {
        var spiedSetTitle;
        spiedSetTitle = null;
        beforeEach(function() {
          context.line = 'title Dummy flow';
          spiedSetTitle = sinon.spy(context, 'setTitle');
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('sets title', function() {
          return expect(spiedSetTitle).to.have.been.calledWith('Dummy flow');
        });
      });
      describe('title already assigned', function() {
        beforeEach(function() {
          context.title = 'Test title';
          return context.line = 'title Dummy Flow';
        });
        return it('throws', function() {
          return expect(function() {
            return handler.handles(context);
          }).to["throw"](errorMessage);
        });
      });
      describe('participants already assigned', function() {
        beforeEach(function() {
          context.participants.push('Component A');
          return context.line = 'title Dummy flow';
        });
        return it('throws', function() {
          return expect(function() {
            return handler.handles(context);
          }).to["throw"](errorMessage);
        });
      });
      return describe('commands already assigned', function() {
        beforeEach(function() {
          context.commands.push('A -> B: Test');
          return context.line = 'title Dummy flow';
        });
        return it('throws', function() {
          return expect(function() {
            return handler.handles(context);
          }).to["throw"](errorMessage);
        });
      });
    });
  });
});
