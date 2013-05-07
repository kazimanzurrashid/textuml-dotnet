
define(function(require) {
  var Diagram;
  Diagram = require('../../../../../application/uml/models/sequence/diagram');
  return describe('uml/models/sequence/diagram', function() {
    return describe('new', function() {
      var diagram;
      diagram = null;
      beforeEach(function() {
        return diagram = new Diagram;
      });
      it('title is not set', function() {
        return expect(diagram.title).to.be.undefined;
      });
      it('participants are empty', function() {
        return expect(diagram.participants).to.be.empty;
      });
      return it('commands are empty', function() {
        return expect(diagram.command).to.be.empty;
      });
    });
  });
});
