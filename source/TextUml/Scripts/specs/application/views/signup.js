
define(function(require) {
  var Model, SignUp;
  SignUp = require('../../../application/views/signup');
  Model = require('../../../application/models/user');
  return describe('views/signup', function() {
    it('has User as #modelType', function() {
      return expect(SignUp.prototype.modelType).to.be.deep.equal(Model);
    });
    it('has signedUp as #successEvent', function() {
      return expect(SignUp.prototype.successEvent).to.equal('signedUp');
    });
    return it('can handle ajax error', function() {
      return expect(SignUp).to.respondTo('handleError');
    });
  });
});
