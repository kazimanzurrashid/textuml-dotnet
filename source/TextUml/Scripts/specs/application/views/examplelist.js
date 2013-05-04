define(function(require) {
  var $, ExampleList, events;

  $ = require('jquery');
  ExampleList = require('../../../application/views/examplelist');
  events = require('../../../application/events');
  return describe('views/examplelist', function() {
    var stubbedRender, view;

    stubbedRender = null;
    view = null;
    before(function() {
      stubbedRender = sinon.stub(ExampleList.prototype, 'render', function() {});
      fixtures.set('<ul id="example-list"></ul>');
      return view = new ExampleList({
        el: $(fixtures.window().document.body).find('#example-list')
      });
    });
    describe('new', function() {
      it('auto populates the collection', function() {
        return expect(view.collection).to.not.be.empty;
      });
      return it('renders collection', function() {
        return expect(stubbedRender).to.have.been.calledOnce;
      });
    });
    describe('#select', function() {
      var example, stubbedCollectionGet, stubbedEventsTrigger;

      example = {};
      stubbedEventsTrigger = null;
      stubbedCollectionGet = null;
      before(function() {
        stubbedCollectionGet = sinon.stub(view.collection, 'get', function() {
          return example;
        });
        stubbedEventsTrigger = sinon.stub(events, 'trigger');
        return view.select({
          currentTarget: 'foo-bar'
        });
      });
      it('triggers exampleSelected application event', function() {
        return expect(stubbedEventsTrigger).to.have.been.calledWith('exampleSelected', {
          example: example
        });
      });
      return after(function() {
        stubbedCollectionGet.restore();
        return stubbedEventsTrigger.restore();
      });
    });
    return after(function() {
      stubbedRender.restore();
      view.undelegateEvents();
      view.stopListening();
      return fixtures.cleanUp();
    });
  });
});
