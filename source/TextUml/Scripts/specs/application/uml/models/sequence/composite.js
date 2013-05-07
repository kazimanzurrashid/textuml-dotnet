
define(function(require) {
  var Composite;
  Composite = require('../../../../../application/uml/models/sequence/composite');
  return describe('uml/models/sequence/composite', function() {
    return describe('new', function() {
      var composite;
      composite = null;
      beforeEach(function() {
        return composite = new Composite;
      });
      return it('children is empty', function() {
        return expect(composite.children).to.be.empty;
      });
    });
  });
});
