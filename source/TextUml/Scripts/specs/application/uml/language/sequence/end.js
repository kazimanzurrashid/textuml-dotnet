(function() {
  define(function(require) {
    var End;

    End = require('../../../../../application/uml/language/sequence/end');
    return describe('uml/language/sequence/end', function() {
      var handler;

      handler = null;
      beforeEach(function() {
        return handler = new End;
      });
      return describe('#handles', function() {
        var context, result;

        context = null;
        result = null;
        describe('valid', function() {
          var spiedCloseParent;

          spiedCloseParent = null;
          beforeEach(function() {
            context = {
              line: 'end',
              closeParent: function() {}
            };
            spiedCloseParent = sinon.spy(context, 'closeParent');
            return result = handler.handles(context);
          });
          it('handles', function() {
            return expect(result).to.be.ok;
          });
          return it('closes parent command of context', function() {
            return expect(context.closeParent).to.have.been.called;
          });
        });
        return describe('invalid', function() {
          beforeEach(function() {
            context = {
              line: 'This is an invalid end'
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

}).call(this);
