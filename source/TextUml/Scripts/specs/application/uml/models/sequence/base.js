
define(function(require) {
  var Base, Composite;
  Base = require('../../../../../application/uml/models/sequence/base');
  Composite = require('../../../../../application/uml/models/sequence/composite');
  return describe('uml/models/sequence/base', function() {
    describe('new', function() {
      var base;
      base = null;
      describe('without parent', function() {
        before(function() {
          return base = new Base;
        });
        return it('has no parent', function() {
          return expect(base.parent).to.not.be.ok;
        });
      });
      return describe('with parent', function() {
        var parent;
        parent = null;
        before(function() {
          parent = new Composite;
          return base = new Base(parent);
        });
        return it('has same parent', function() {
          return expect(base.parent).to.deep.equal(parent);
        });
      });
    });
    return describe('#setParent', function() {
      var base;
      base = null;
      describe('new', function() {
        var parent;
        parent = null;
        beforeEach(function() {
          parent = new Composite;
          base = new Base;
          return base.setParent(parent);
        });
        return it('appends itself in parent child collection', function() {
          return expect(parent.children).to.contain(base);
        });
      });
      return describe('existing', function() {
        var newParent, oldParent;
        oldParent = null;
        newParent = null;
        beforeEach(function() {
          oldParent = new Composite;
          newParent = new Composite;
          base = new Base(oldParent);
          return base.setParent(newParent);
        });
        return it('removes itself from old parent child collection', function() {
          return expect(oldParent.children).to.not.contain(base);
        });
      });
    });
  });
});
