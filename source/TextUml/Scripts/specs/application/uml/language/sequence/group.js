
define(function(require) {
  var Group;
  Group = require('../../../../../application/uml/language/sequence/group');
  return describe('uml/language/sequence/group', function() {
    var context, handler, spiedAddGroup;
    context = null;
    spiedAddGroup = null;
    handler = null;
    beforeEach(function() {
      handler = new Group;
      context = {
        line: '',
        addGroup: function(type, label) {}
      };
      return spiedAddGroup = sinon.spy(context, 'addGroup');
    });
    return describe('#handles', function() {
      var result;
      result = null;
      describe('opt', function() {
        beforeEach(function() {
          context.line = 'opt leap year';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds group to context', function() {
          return expect(spiedAddGroup).to.have.been.calledWith('opt', 'leap year');
        });
      });
      describe('loop', function() {
        beforeEach(function() {
          context.line = 'loop 10 times';
          return result = handler.handles(context);
        });
        it('handles', function() {
          return expect(result).to.be.ok;
        });
        return it('adds group to context', function() {
          return expect(spiedAddGroup).to.have.been.calledWith('loop', '10 times');
        });
      });
      return describe('invalid', function() {
        beforeEach(function() {
          context.line = 'this is an invalid group';
          return result = handler.handles(context);
        });
        return it('does not handle', function() {
          return expect(result).to.not.be.ok;
        });
      });
    });
  });
});
