
define(function(require) {
  var Condition;
  Condition = require('../../../../../application/uml/language/sequence/condition');
  return describe('uml/language/sequence/condition', function() {
    var handler;
    handler = null;
    before(function() {
      return handler = new Condition;
    });
    return describe('#handles', function() {
      var context, result;
      context = null;
      result = null;
      describe('alt', function() {
        var spiedAddIf;
        spiedAddIf = null;
        before(function() {
          context = {
            line: 'alt morning',
            addIf: function(label) {}
          };
          spiedAddIf = sinon.spy(context, 'addIf');
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds if block to context', function() {
          return expect(spiedAddIf).to.have.been.calledWith('morning');
        });
      });
      describe('else', function() {
        var spiedAddElse;
        spiedAddElse = null;
        before(function() {
          context = {
            line: 'else noon',
            addElse: function(label) {}
          };
          spiedAddElse = sinon.spy(context, 'addElse');
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds else block to context', function() {
          return expect(spiedAddElse).to.have.been.calledWith('noon');
        });
      });
      return describe('invalid', function() {
        before(function() {
          context = {
            line: 'this is an invalid condition'
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
