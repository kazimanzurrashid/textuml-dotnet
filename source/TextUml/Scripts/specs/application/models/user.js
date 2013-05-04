define(function(require) {
  var User, repeatString, _;

  _ = require('underscore');
  User = require('../../../application/models/user');
  repeatString = require('../../helpers').repeatString;
  return describe('models/user', function() {
    var user;

    user = null;
    beforeEach(function() {
      return user = new User;
    });
    describe('#defaults', function() {
      it('has #email', function() {
        return expect(user.defaults()).to.have.property('email');
      });
      it('has #password', function() {
        return expect(user.defaults()).to.have.property('password');
      });
      return it('has #confirmPassword', function() {
        return expect(user.defaults()).to.have.property('confirmPassword');
      });
    });
    describe('#url', function() {
      return it('is set', function() {
        return expect(user.url).to.exist;
      });
    });
    return describe('validation', function() {
      describe('valid', function() {
        beforeEach(function() {
          return user.set({
            email: 'user@example.com',
            password: '$ecre8',
            confirmPassword: '$ecre8'
          });
        });
        return it('is valid', function() {
          return expect(user.isValid()).to.be.ok;
        });
      });
      return describe('invalid', function() {
        describe('#email', function() {
          describe('missing', function() {
            beforeEach(function() {
              return user.set({
                password: '$secret',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('email');
            });
          });
          describe('blank', function() {
            beforeEach(function() {
              return user.set({
                email: '',
                password: '$secret',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('email');
            });
          });
          return describe('incorrect format', function() {
            beforeEach(function() {
              return user.set({
                email: 'foo bar',
                password: '$secret',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('email');
            });
          });
        });
        describe('#password', function() {
          describe('missing', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('password');
            });
          });
          describe('blank', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: '',
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('password');
            });
          });
          describe('less than minimum length', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: repeatString(5),
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('password');
            });
          });
          return describe('more than maximum length', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: repeatString(65),
                confirmPassword: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('password');
            });
          });
        });
        return describe('#confirmPassword', function() {
          describe('missing', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: '$ecre8'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('confirmPassword');
            });
          });
          describe('blank', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: '$ecre8',
                confirmPassword: ''
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('confirmPassword');
            });
          });
          return describe('do not match', function() {
            beforeEach(function() {
              return user.set({
                email: 'user@example.com',
                password: '$ecre8',
                confirmPassword: 'foo bar'
              });
            });
            return it('is invalid', function() {
              expect(user.isValid()).to.not.be.ok;
              return expect(user.validationError).to.have.property('confirmPassword');
            });
          });
        });
      });
    });
  });
});
