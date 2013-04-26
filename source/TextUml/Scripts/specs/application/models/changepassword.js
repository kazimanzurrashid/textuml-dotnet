
define(function(require) {
  var ChangePassword, repeatString, _;
  _ = require('underscore');
  ChangePassword = require('../../../application/models/changepassword');
  repeatString = require('../../helpers').repeatString;
  return describe('models/changepassword', function() {
    var changePassword;
    changePassword = null;
    beforeEach(function() {
      return changePassword = new ChangePassword;
    });
    describe('#defaults', function() {
      it('has #oldPassword', function() {
        return expect(changePassword.defaults()).to.have.property('oldPassword');
      });
      it('has #newPassword', function() {
        return expect(changePassword.defaults()).to.have.property('newPassword');
      });
      return it('has #confirmPassword', function() {
        return expect(changePassword.defaults()).to.have.property('confirmPassword');
      });
    });
    describe('#url', function() {
      return it('is set', function() {
        return expect(changePassword.url).to.exist;
      });
    });
    return describe('validation', function() {
      describe('valid', function() {
        beforeEach(function() {
          return changePassword.set({
            oldPassword: 'secret',
            newPassword: '$ecre8',
            confirmPassword: '$ecre8'
          });
        });
        return it('is valid', function() {
          return expect(changePassword.isValid()).to.be.ok;
        });
      });
      return describe('invalid', function() {
        describe('#oldPassword', function() {
          describe('missing', function() {
            beforeEach(function() {
              return changePassword.set({
                newPassword: '$ecre8',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('oldPassword');
            });
          });
          return describe('blank', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: '',
                newPassword: '$ecre8',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('oldPassword');
            });
          });
        });
        describe('#newPassword', function() {
          describe('missing', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('newPassword');
            });
          });
          describe('blank', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: '',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('newPassword');
            });
          });
          describe('less than minimum length', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: repeatString(5),
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('newPassword');
            });
          });
          return describe('more than maximum length', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: repeatString(65),
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('newPassword');
            });
          });
        });
        return describe('#confirmPassword', function() {
          describe('missing', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('confirmPassword');
            });
          });
          describe('blank', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: '$ecre8',
                confirmPassword: ''
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('confirmPassword');
            });
          });
          return describe('do not match', function() {
            beforeEach(function() {
              return changePassword.set({
                oldPassword: 'secret',
                newPassword: '$ecre8',
                confirmPassword: 'foo bar'
              });
            });
            return it('is invalid', function() {
              expect(changePassword.isValid()).to.not.be.ok;
              return expect(changePassword.validationError).to.have.property('confirmPassword');
            });
          });
        });
      });
    });
  });
});
