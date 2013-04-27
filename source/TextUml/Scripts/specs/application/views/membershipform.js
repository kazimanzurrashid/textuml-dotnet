
define(function(require) {
  var $, Backbone, MembershipForm, events;
  $ = require('jquery');
  Backbone = require('backbone');
  MembershipForm = require('../../../application/views/membershipform');
  events = require('../../../application/events');
  return describe('views/membershipform', function() {
    var model, stubbedModel, successEvent, view;
    view = null;
    model = null;
    stubbedModel = null;
    successEvent = 'dummy-event';
    before(function() {
      fixtures.set('<form id="form"></form>');
      model = {
        once: function() {},
        save: function() {}
      };
      stubbedModel = sinon.stub(Backbone, 'Model').returns(model);
      view = new MembershipForm({
        el: $(fixtures.window().document.body).find('#form')
      });
      view.modelType = Backbone.Model;
      return view.successEvent = successEvent;
    });
    describe('form submit', function() {
      var spiedOnce, spiedSave;
      spiedOnce = null;
      spiedSave = null;
      before(function() {
        spiedOnce = sinon.spy(model, 'once');
        spiedSave = sinon.spy(model, 'save');
        return view.$el.trigger('submit');
      });
      it('creates model', function() {
        return expect(stubbedModel.calledOnce).to.be.ok;
      });
      it('subscribes to model invalid event', function() {
        return expect(spiedOnce.calledWithExactly('invalid', sinon.match.func)).to.be.ok;
      });
      it('saves model', function() {
        return expect(spiedSave.calledOnce).to.be.ok;
      });
      return after(function() {
        spiedOnce.restore();
        return spiedSave.restore();
      });
    });
    describe('persistence', function() {
      var stubbedSave;
      stubbedSave = null;
      describe('success', function() {
        var successEventTriggered;
        successEventTriggered = null;
        beforeEach(function(done) {
          successEventTriggered = false;
          stubbedSave = sinon.stub(model, 'save').yieldsTo('success');
          events.on(successEvent, function() {
            successEventTriggered = true;
            return done();
          });
          return view.$el.trigger('submit');
        });
        return it('triggers application event', function() {
          return expect(successEventTriggered).to.be["true"];
        });
      });
      describe('failure', function() {
        var stubbedHandleError;
        stubbedHandleError = null;
        beforeEach(function() {
          stubbedSave = sinon.stub(model, 'save').yieldsTo('error');
          stubbedHandleError = sinon.stub(view, 'handleError', function() {});
          return view.$el.trigger('submit');
        });
        it('handles error', function() {
          return expect(stubbedHandleError.calledOnce).to.be.ok;
        });
        return afterEach(function() {
          return stubbedHandleError.restore();
        });
      });
      return afterEach(function() {
        return stubbedSave.restore();
      });
    });
    return after(function() {
      stubbedModel.restore();
      return fixtures.cleanUp();
    });
  });
});
