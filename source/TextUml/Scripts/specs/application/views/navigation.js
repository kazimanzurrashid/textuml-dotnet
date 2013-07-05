
define(function(require) {
  var $, Navigation, events;
  $ = require('jquery');
  Navigation = require('../../../application/views/navigation');
  events = require('../../../application/events');
  return describe('views/navigation', function() {
    var view;
    view = null;
    before(function() {
      fixtures.set("<div id=\"navigation\">\n  <ul class=\"nav\">\n    <li class=\"test-1\">\n      <a  data-command=\"dummy-event\" href=\"javascript:;\">Test 1</a>\n    </li>\n    <li class=\"test-2\">\n      <a href=\"javascript:;\">Test 2</a>\n    </li>\n  </ul>\n</div>");
      return view = new Navigation({
        el: $(fixtures.window().document.body).find('#navigation')
      });
    });
    describe('menu item clicks', function() {
      var stubbedTrigger;
      stubbedTrigger = null;
      beforeEach(function() {
        return stubbedTrigger = sinon.stub(events, 'trigger', function() {});
      });
      describe('has data-command attribute', function() {
        beforeEach(function() {
          return view.$('a').first().trigger('click');
        });
        return it('triggers application event', function() {
          return expect(stubbedTrigger).to.have.been.calledWith('dummy-event');
        });
      });
      describe('no data-command attribute', function() {
        beforeEach(function() {
          return view.$('a').last().trigger('click');
        });
        return it('does not trigger any event', function() {
          return expect(stubbedTrigger).to.not.have.been.called;
        });
      });
      return afterEach(function() {
        return stubbedTrigger.restore();
      });
    });
    return after(function() {
      view.undelegateEvents();
      view.stopListening();
      return fixtures.cleanUp();
    });
  });
});
