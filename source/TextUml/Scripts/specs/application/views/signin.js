
define(function(require) {
  var Model, SignIn;
  SignIn = require('../../../application/views/signin');
  Model = require('../../../application/models/session');
  return describe('views/signin', function() {
    it('has Session as #modelType', function() {
      return expect(SignIn.prototype.modelType).to.be.deep.equal(Model);
    });
    it('has signedIn as #successEvent', function() {
      return expect(SignIn.prototype.successEvent).to.equal('signedIn');
    });
    return it('can handle ajax error', function() {
      return expect(SignIn).to.respondTo('handleError');
    });
  });
});
