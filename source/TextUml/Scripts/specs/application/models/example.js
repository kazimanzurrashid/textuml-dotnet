
define(function(require) {
  var Example;
  Example = require('../../../application/models/example');
  return describe('models/example', function() {
    var example;
    example = null;
    beforeEach(function() {
      return example = new Example;
    });
    return describe('#defaults', function() {
      it('has #display', function() {
        return expect(example.defaults()).to.have.property('display');
      });
      return it('has #snippet', function() {
        return expect(example.defaults()).to.have.property('snippet');
      });
    });
  });
});
