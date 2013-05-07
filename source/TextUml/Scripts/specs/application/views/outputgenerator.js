
define(function(require) {
  var $, OutputGenerator, events;
  $ = require('jquery');
  OutputGenerator = require('../../../application/views/outputgenerator');
  events = require('../../../application/events');
  return describe('views/outputgenerator', function() {
    var spiedListenTo, view;
    spiedListenTo = null;
    view = null;
    before(function() {
      fixtures.set('<textarea id="output-text-area"></textarea>');
      spiedListenTo = sinon.spy(OutputGenerator.prototype, 'listenTo');
      return view = new OutputGenerator({
        el: $(fixtures.window().document.body).find('#output-text-area')
      });
    });
    describe('new', function() {
      it('subscribes to parseStarted application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'parseStarted', view.onParseStarted);
      });
      it('subscribes to parseWarning and parseError application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'parseWarning parseError', view.onParseWarningOrError);
      });
      return it('subscribes to parseCompleted application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'parseCompleted', view.onParseCompleted);
      });
    });
    describe('onParseStarted', function() {
      before(function() {
        view.$el.val('foo bar');
        return view.onParseStarted();
      });
      return it('clears the content', function() {
        return expect(view.$el).to.have.value('');
      });
    });
    describe('onParseWarningOrError', function() {
      before(function() {
        view.$el.val('1st warning/error');
        return view.onParseWarningOrError({
          message: '2nd warning/error'
        });
      });
      return it('appends to the content', function() {
        return expect(view.$el).to.have.value('1st warning/error\n2nd warning/error');
      });
    });
    describe('onParseCompleted', function() {
      beforeEach(function() {
        return view.$el.val('some message');
      });
      describe('with diagram', function() {
        beforeEach(function() {
          return view.onParseCompleted({
            diagram: sinon.stub()
          });
        });
        return it('appends success message to the content', function() {
          return expect(view.$el).to.have.value('some message\nDiagram generated successfully.');
        });
      });
      return describe('without diagram', function() {
        beforeEach(function() {
          return view.onParseCompleted();
        });
        return it('does nothing', function() {
          return expect(view.$el).to.have.value('some message');
        });
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
