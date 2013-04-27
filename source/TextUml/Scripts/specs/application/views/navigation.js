
define(function(require) {
  var $, Navigation, events;
  $ = require('jquery');
  Navigation = require('../../../application/views/navigation');
  events = require('../../../application/events');
  return describe('views/navigation', function() {
    var navigation;
    navigation = null;
    before(function() {
      fixtures.load('/navigation.html');
      return navigation = new Navigation({
        el: $(fixtures.window().document.body).find('#navigation')
      });
    });
    describe('application events', function() {
      var stubbedTrigger;
      stubbedTrigger = null;
      beforeEach(function() {
        return stubbedTrigger = sinon.stub(events, 'trigger');
      });
      describe('menu item clicks', function() {
        describe('has data-command attribute', function() {
          beforeEach(function() {
            return navigation.$el.find('a').first().trigger('click');
          });
          return it('triggers event', function() {
            return expect(stubbedTrigger.calledWith('dummy-event')).to.be.ok;
          });
        });
        return describe('no data-command attribute', function() {
          beforeEach(function() {
            return navigation.$el.find('a').last().trigger('click');
          });
          return it('does not trigger any event', function() {
            return expect(stubbedTrigger.called).to.not.be.ok;
          });
        });
      });
      return afterEach(function() {
        return stubbedTrigger.restore();
      });
    });
    return after(function() {
      return fixtures.cleanUp();
    });
  });
});
