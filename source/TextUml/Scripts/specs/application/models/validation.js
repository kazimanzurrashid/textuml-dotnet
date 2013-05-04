define(function(require) {
  var Validation, repeatString;

  Validation = require('../../../application/models/validation');
  repeatString = require('../../helpers').repeatString;
  return describe('models/validation', function() {
    describe('.isValidEmailFormat', function() {
      describe('valid', function() {
        return it('returns true', function() {
          return expect(Validation.isValidEmailFormat('user@example.com')).to.be.ok;
        });
      });
      return describe('invalid', function() {
        return it('returns false', function() {
          return expect(Validation.isValidEmailFormat('foo-bar')).not.to.be.ok;
        });
      });
    });
    describe('.isValidPasswordLength', function() {
      describe('valid', function() {
        return it('returns true', function() {
          return expect(Validation.isValidPasswordLength('$ecre8')).to.be.ok;
        });
      });
      return describe('invalid', function() {
        describe('less than six characters', function() {
          return it('returns false', function() {
            return expect(Validation.isValidPasswordLength(repeatString(5))).not.to.be.ok;
          });
        });
        return describe('more than sixty four characters', function() {
          return it('returns false', function() {
            return expect(Validation.isValidPasswordLength(repeatString(65))).not.to.be.ok;
          });
        });
      });
    });
    return describe('.addError', function() {
      var errors;

      errors = null;
      beforeEach(function() {
        errors = {};
        return Validation.addError(errors, 'name', 'Name is required.');
      });
      it('creates new attribute', function() {
        return expect(errors).to.include.key('name');
      });
      return it('appends message', function() {
        return expect(errors.name).to.include('Name is required.');
      });
    });
  });
});
