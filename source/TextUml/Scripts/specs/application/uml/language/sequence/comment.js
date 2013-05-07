
define(function(require) {
  var Comment;
  Comment = require('../../../../../application/uml/language/sequence/comment');
  return describe('uml/language/sequence/comment', function() {
    var handler;
    handler = null;
    beforeEach(function() {
      return handler = new Comment;
    });
    return describe('#handles', function() {
      var context, result;
      context = null;
      result = null;
      describe('valid', function() {
        beforeEach(function() {
          context = {
            line: '\' This is a comment'
          };
          return result = handler.handles(context);
        });
        return it('handles', function() {
          return expect(result).to.be.ok;
        });
      });
      return describe('invalid', function() {
        beforeEach(function() {
          context = {
            line: 'This is an invalid comment'
          };
          return result = handler.handles(context);
        });
        return it('does not handle', function() {
          return expect(result).to.not.be.ok;
        });
      });
    });
  });
});
