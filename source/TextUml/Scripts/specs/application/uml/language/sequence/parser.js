(function() {
  define(function(require) {
    var Comment, Condition, End, Group, Message, Parser, Participant, Title;

    Comment = require('../../../../../application/uml/language/sequence/comment');
    Title = require('../../../../../application/uml/language/sequence/title');
    Participant = require('../../../../../application/uml/language/sequence/participant');
    Message = require('../../../../../application/uml/language/sequence/message');
    Group = require('../../../../../application/uml/language/sequence/group');
    Condition = require('../../../../../application/uml/language/sequence/condition');
    End = require('../../../../../application/uml/language/sequence/end');
    Parser = require('../../../../../application/uml/language/sequence/parser');
    return describe('uml/language/sequence/parser', function() {
      var parser;

      parser = null;
      describe('new', function() {
        before(function() {
          return parser = new Parser;
        });
        return describe('default handlers', function() {
          it('creates comment handler', function() {
            return expect(parser.handlers[0]).to.be.an["instanceof"](Comment);
          });
          it('creates title handler', function() {
            return expect(parser.handlers[1]).to.be.an["instanceof"](Title);
          });
          it('creates participant handler', function() {
            return expect(parser.handlers[2]).to.be.an["instanceof"](Participant);
          });
          it('creates message handler', function() {
            return expect(parser.handlers[3]).to.be.an["instanceof"](Message);
          });
          it('creates group handler', function() {
            return expect(parser.handlers[4]).to.be.an["instanceof"](Group);
          });
          it('creates condition handler', function() {
            return expect(parser.handlers[5]).to.be.an["instanceof"](Condition);
          });
          return it('creates end handler', function() {
            return expect(parser.handlers[6]).to.be.an["instanceof"](End);
          });
        });
      });
      return describe('#parse', function() {
        describe('duplicate empty lines', function() {
          var originalContextType, stubbedContextType;

          originalContextType = null;
          stubbedContextType = null;
          before(function() {
            originalContextType = Parser.prototype.contextType;
            stubbedContextType = sinon.stub().returns({});
            Parser.prototype.contextType = stubbedContextType;
            parser = new Parser;
            return parser.parse('line1\n\nline2\nline3');
          });
          it('discards', function() {
            return expect(stubbedContextType).to.have.been.calledWith('line1\nline2\nline3');
          });
          return after(function() {
            return Parser.prototype.contextType = originalContextType;
          });
        });
        describe('onStart callback', function() {
          var spiedOnStart;

          spiedOnStart = null;
          before(function() {
            spiedOnStart = sinon.spy();
            parser = new Parser({
              callbacks: {
                onStart: spiedOnStart
              }
            });
            return parser.parse('');
          });
          return it('triggers the callback', function() {
            return expect(spiedOnStart).to.have.been.calledOnce;
          });
        });
        describe('onComplete callback', function() {
          describe('empty input', function() {
            var spiedOnComplete;

            spiedOnComplete = null;
            before(function() {
              spiedOnComplete = sinon.spy();
              parser = new Parser({
                callbacks: {
                  onComplete: spiedOnComplete
                }
              });
              return parser.parse('');
            });
            return it('triggers the callback', function() {
              return expect(spiedOnComplete).to.have.been.calledWith();
            });
          });
          return describe('valid input', function() {
            var diagram, originalContextType, spiedOnComplete, stubbedContextType;

            originalContextType = null;
            stubbedContextType = null;
            diagram = null;
            spiedOnComplete = null;
            before(function() {
              var context;

              diagram = {
                participants: [sinon.stub()]
              };
              context = {
                updateLineInfo: function() {},
                getLineNumber: function() {
                  return 0;
                },
                done: function() {},
                getDiagram: function() {
                  return diagram;
                }
              };
              originalContextType = Parser.prototype.contextType;
              stubbedContextType = sinon.stub().returns(context);
              Parser.prototype.contextType = stubbedContextType;
              spiedOnComplete = sinon.spy();
              parser = new Parser({
                callbacks: {
                  onComplete: spiedOnComplete
                }
              });
              parser.handlers = [];
              return parser.parse('line1\nline2\nline3');
            });
            it('triggers the callback with the parsed diagram', function() {
              return expect(spiedOnComplete).to.have.been.calledWith(diagram);
            });
            return after(function() {
              return Parser.prototype.contextType = originalContextType;
            });
          });
        });
        describe('onWarning callback', function() {
          return describe('unknown syntax', function() {
            var spiedOnWarning;

            spiedOnWarning = null;
            before(function() {
              spiedOnWarning = sinon.spy();
              parser = new Parser({
                callbacks: {
                  onWarning: spiedOnWarning
                }
              });
              return parser.parse('test input');
            });
            return it('triggers the callback', function() {
              return expect(spiedOnWarning).to.have.been.calledWithMatch(/Warning on line 1/);
            });
          });
        });
        return describe('onError callback', function() {
          return describe('on exception', function() {
            var exception, spiedOnError;

            spiedOnError = null;
            exception = null;
            before(function() {
              exception = new Error;
              spiedOnError = sinon.spy();
              parser = new Parser({
                callbacks: {
                  onError: spiedOnError
                }
              });
              parser.handlers = [
                {
                  handles: function() {
                    throw exception;
                  }
                }
              ];
              return parser.parse('test input');
            });
            return it('triggers the callback', function() {
              return expect(spiedOnError).to.have.been.calledWith(exception);
            });
          });
        });
      });
    });
  });

}).call(this);
