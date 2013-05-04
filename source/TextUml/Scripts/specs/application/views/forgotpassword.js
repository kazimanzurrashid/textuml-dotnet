
define(function(require) {
  var ForgotPassword, Model;
  ForgotPassword = require('../../../application/views/forgotpassword');
  Model = require('../../../application/models/forgotpassword');
  return describe('views/forgotpassword', function() {
    it('has ForgotPassword as #modelType', function() {
      return expect(ForgotPassword.prototype.modelType).to.be.deep.equal(Model);
    });
    it('has passwordResetTokenRequested as #successEvent', function() {
      return expect(ForgotPassword.prototype.successEvent).to.equal('passwordResetTokenRequested');
    });
    return it('can handle ajax error', function() {
      return expect(ForgotPassword).to.respondTo('handleError');
    });
  });
});
