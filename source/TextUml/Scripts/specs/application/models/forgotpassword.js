define(function(require) {
  var ForgotPassword;

  ForgotPassword = require('../../../application/models/forgotpassword');
  return describe('models/forgotpassword', function() {
    var forgotPassword;

    forgotPassword = null;
    beforeEach(function() {
      return forgotPassword = new ForgotPassword;
    });
    describe('#defaults', function() {
      return it('has #email', function() {
        return expect(forgotPassword.defaults()).to.have.property('email');
      });
    });
    describe('#url', function() {
      return it('is set', function() {
        return expect(forgotPassword.url).to.exist;
      });
    });
    return describe('validation', function() {
      describe('valid', function() {
        beforeEach(function() {
          return forgotPassword.set({
            email: 'user@example.com'
          });
        });
        return it('is valid', function() {
          return expect(forgotPassword.isValid()).to.be.ok;
        });
      });
      return describe('invalid', function() {
        describe('missing', function() {
          return it('is invalid', function() {
            expect(forgotPassword.isValid()).to.not.be.ok;
            return expect(forgotPassword.validationError).to.have.property('email');
          });
        });
        describe('blank', function() {
          beforeEach(function() {
            return forgotPassword.set({
              email: ''
            });
          });
          return it('is invalid', function() {
            expect(forgotPassword.isValid()).to.not.be.ok;
            return expect(forgotPassword.validationError).to.have.property('email');
          });
        });
        return describe('incorrect format', function() {
          beforeEach(function() {
            return forgotPassword.set({
              email: 'foo bar'
            });
          });
          return it('is invalid', function() {
            expect(forgotPassword.isValid()).to.not.be.ok;
            return expect(forgotPassword.validationError).to.have.property('email');
          });
        });
      });
    });
  });
});
