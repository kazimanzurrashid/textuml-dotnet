
define(function(require) {
  var Document, _;
  _ = require('underscore');
  Document = require('../../../application/models/document');
  return describe('models/document', function() {
    var document;
    document = null;
    beforeEach(function() {
      return document = new Document;
    });
    describe('#defaults', function() {
      it('has #title', function() {
        return expect(document.defaults()).to.have.property('title');
      });
      it('has #content', function() {
        return expect(document.defaults()).to.have.property('content');
      });
      it('has #createdAt', function() {
        return expect(document.defaults()).to.have.property('createdAt');
      });
      return it('has #updatedAt', function() {
        return expect(document.defaults()).to.have.property('updatedAt');
      });
    });
    describe('#urlRoot', function() {
      return it('is set', function() {
        return expect(document.urlRoot).to.exist;
      });
    });
    return describe('validation', function() {
      describe('valid', function() {
        beforeEach(function() {
          return document.set({
            title: 'Test Diagram',
            content: 'A -> B: Method1',
            createdAt: new Date,
            updatedAt: new Date
          });
        });
        return it('is valid', function() {
          return expect(document.isValid()).to.be.ok;
        });
      });
      return describe('invalid', function() {
        return describe('#title', function() {
          describe('missing', function() {
            return it('is invalid', function() {
              expect(document.isValid()).to.not.be.ok;
              return expect(document.validationError).to.have.property('title');
            });
          });
          return describe('blank', function() {
            beforeEach(function() {
              return document.set({
                title: ''
              });
            });
            return it('is invalid', function() {
              expect(document.isValid()).to.not.be.ok;
              return expect(document.validationError).to.have.property('title');
            });
          });
        });
      });
    });
  });
});
