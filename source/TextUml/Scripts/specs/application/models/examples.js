
define(function(require) {
  var Example, Examples;
  Example = require('../../../application/models/example');
  Examples = require('../../../application/models/examples');
  return describe('models/examples', function() {
    var examples;
    examples = null;
    beforeEach(function() {
      return examples = new Examples;
    });
    return describe('#model', function() {
      return it('is Example', function() {
        return expect(examples.model).to.eql(Example);
      });
    });
  });
});
