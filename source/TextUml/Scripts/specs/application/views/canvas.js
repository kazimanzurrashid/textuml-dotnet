(function() {
  define(function(require) {
    var $, Canvas, events;

    $ = require('jquery');
    Canvas = require('../../../application/views/canvas');
    events = require('../../../application/events');
    return describe('views/canvas', function() {
      var context, spiedListenTo, view;

      context = null;
      spiedListenTo = null;
      view = null;
      before(function() {
        fixtures.set('<div id="canvas-container"></div>');
        context = {
          setCurrentDocumentTitle: function(title) {}
        };
        spiedListenTo = sinon.spy(Canvas.prototype, 'listenTo');
        return view = new Canvas({
          el: $(fixtures.window().document.body).find('#canvas-container'),
          context: context
        });
      });
      describe('new', function() {
        it('creates renderer', function() {
          return expect(view.renderer).to.exist;
        });
        it('subscribes to parseStarted application event', function() {
          return expect(spiedListenTo).to.have.been.calledWith(events, 'parseStarted', view.onParseStarted);
        });
        it('subscribes to parseCompleted application event', function() {
          return expect(spiedListenTo).to.have.been.calledWith(events, 'parseCompleted', view.onParseCompleted);
        });
        return it('subscribes to exportDocument application event', function() {
          return expect(spiedListenTo).to.have.been.calledWith(events, 'exportDocument', view.onExportDocument);
        });
      });
      describe('#onParseStarted', function() {
        var stubbedReset;

        stubbedReset = null;
        before(function() {
          stubbedReset = sinon.stub(view.renderer, 'reset', function() {});
          return view.onParseStarted();
        });
        it('resets the renderer', function() {
          return expect(stubbedReset).to.have.been.calledOnce;
        });
        return after(function() {
          return stubbedReset.reset();
        });
      });
      describe('#onParseCompleted', function() {
        var spiedSetTitle, stubbedRender;

        stubbedRender = null;
        spiedSetTitle = null;
        before(function() {
          stubbedRender = sinon.stub(view.renderer, 'render', function() {});
          return spiedSetTitle = sinon.spy(context, 'setCurrentDocumentTitle');
        });
        describe('with diagram', function() {
          var diagram;

          diagram = null;
          before(function() {
            diagram = {
              title: {
                text: 'dummy'
              }
            };
            return view.onParseCompleted({
              diagram: diagram
            });
          });
          it('renders diagram', function() {
            return expect(stubbedRender).to.have.been.calledWith(diagram);
          });
          it('sets current document title', function() {
            return expect(spiedSetTitle).to.have.been.calledWith(diagram.title.text);
          });
          return after(function() {
            stubbedRender.reset();
            return spiedSetTitle.reset();
          });
        });
        describe('without diagram', function() {
          before(function() {
            return view.onParseCompleted();
          });
          it('does not render diagram', function() {
            return expect(stubbedRender).to.not.have.been.called;
          });
          it('sets current document title to null', function() {
            return expect(spiedSetTitle).to.have.been.calledWith(null);
          });
          return after(function() {
            stubbedRender.reset();
            return spiedSetTitle.reset();
          });
        });
        return after(function() {
          stubbedRender.restore();
          return spiedSetTitle.restore();
        });
      });
      describe('#onExportDocument', function() {
        var stubbedSerialize;

        stubbedSerialize = null;
        before(function() {
          return stubbedSerialize = sinon.stub(view.renderer, 'serialize');
        });
        describe('success', function() {
          var data, stubbedEventTrigger;

          data = 'base64 encoded string';
          stubbedEventTrigger = null;
          before(function() {
            stubbedEventTrigger = sinon.stub(events, 'trigger', function() {});
            stubbedSerialize.returns(data);
            return view.onExportDocument();
          });
          it('triggers documentExported application event', function() {
            return expect(stubbedEventTrigger).to.have.been.calledWith('documentExported', {
              data: data
            });
          });
          return after(function() {
            stubbedSerialize.reset();
            return stubbedEventTrigger.restore();
          });
        });
        describe('error', function() {
          var errorMessage, stubbedShowErrorbar;

          errorMessage = 'An user defined error';
          stubbedShowErrorbar = null;
          before(function() {
            stubbedSerialize.throws(new Error(errorMessage));
            stubbedShowErrorbar = sinon.stub($, 'showErrorbar', function() {});
            return view.onExportDocument();
          });
          it('shows error bar', function() {
            return expect(stubbedShowErrorbar).to.have.been.calledWith(errorMessage);
          });
          return after(function() {
            stubbedSerialize.reset();
            return stubbedShowErrorbar.restore();
          });
        });
        return after(function() {
          return stubbedSerialize.restore();
        });
      });
      return after(function() {
        view.undelegateEvents();
        view.stopListening();
        spiedListenTo.restore();
        return fixtures.cleanUp();
      });
    });
  });

}).call(this);
