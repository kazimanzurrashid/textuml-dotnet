
define(function(require) {
  var $, Backbone, Helpers, MembershipForm, events;
  $ = require('jquery');
  Backbone = require('backbone');
  MembershipForm = require('../../../application/views/membershipform');
  Helpers = require('../../../application/views/helpers');
  events = require('../../../application/events');
  return describe('views/membershipform', function() {
    var view;
    view = null;
    before(function() {
      fixtures.set('<form id="form"></form>');
      return view = new MembershipForm({
        el: $(fixtures.window().document.body).find('#form')
      });
    });
    describe('#onSubmit', function() {
      var model, stubbedHideFieldErrors, stubbedHideSummaryError, stubbedModel, stubbedSerializeFields, stubbedSubscribeModelInvalidEvent;
      model = null;
      stubbedModel = null;
      stubbedHideSummaryError = null;
      stubbedHideFieldErrors = null;
      stubbedSubscribeModelInvalidEvent = null;
      stubbedSerializeFields = null;
      before(function() {
        model = {
          save: function() {}
        };
        stubbedModel = sinon.stub(Backbone, 'Model').returns(model);
        view.modelType = Backbone.Model;
        stubbedSubscribeModelInvalidEvent = sinon.stub(Helpers, 'subscribeModelInvalidEvent', function() {});
        stubbedHideSummaryError = sinon.stub(view.$el, 'hideSummaryError', function() {
          return view.$el;
        });
        stubbedHideFieldErrors = sinon.stub(view.$el, 'hideFieldErrors', function() {
          return view.$el;
        });
        return stubbedSerializeFields = sinon.stub(view.$el, 'serializeFields', function() {
          return {};
        });
      });
      describe('form submit', function() {
        var spiedSave;
        spiedSave = null;
        before(function() {
          spiedSave = sinon.spy(model, 'save');
          return view.onSubmit({
            preventDefault: function() {}
          });
        });
        it('hides form errors', function() {
          return expect(stubbedHideSummaryError).to.have.been.called;
        });
        it('hides field errors', function() {
          return expect(stubbedHideFieldErrors).to.have.been.called;
        });
        it('creates model', function() {
          return expect(stubbedModel).to.have.been.called;
        });
        it('subscribes to model invalid event once', function() {
          return expect(stubbedSubscribeModelInvalidEvent).to.have.been.calledWith(model, view.$el);
        });
        it('serializes form fields', function() {
          return expect(stubbedSerializeFields).to.have.been.called;
        });
        it('saves model', function() {
          return expect(spiedSave).to.have.been.CalledOnce;
        });
        return after(function() {
          return spiedSave.restore();
        });
      });
      describe('persistence', function() {
        describe('success', function() {
          var stubbedEventsTrigger, stubbedSave, successEvent;
          successEvent = 'dummy-event';
          stubbedSave = null;
          stubbedEventsTrigger = null;
          before(function() {
            stubbedSave = sinon.stub(model, 'save').yieldsTo('success');
            stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
            view.successEvent = successEvent;
            return view.onSubmit({
              preventDefault: function() {}
            });
          });
          it('triggers application event', function() {
            return expect(stubbedEventsTrigger).to.have.been.calledWith(successEvent);
          });
          return after(function() {
            stubbedSave.restore();
            return stubbedEventsTrigger.restore();
          });
        });
        return describe('error', function() {
          var stubbedHandleError, stubbedSave;
          stubbedSave = null;
          stubbedHandleError = null;
          before(function() {
            stubbedSave = sinon.stub(model, 'save').yieldsTo('error');
            stubbedHandleError = sinon.stub(view, 'handleError', function() {});
            return view.onSubmit({
              preventDefault: function() {}
            });
          });
          it('handles error', function() {
            return expect(stubbedHandleError).to.have.been.CalledOnce;
          });
          return after(function() {
            stubbedSave.restore();
            return stubbedHandleError.restore();
          });
        });
      });
      return after(function() {
        stubbedSubscribeModelInvalidEvent.restore();
        stubbedHideSummaryError.restore();
        stubbedHideFieldErrors.restore();
        stubbedSerializeFields.restore();
        return stubbedModel.restore();
      });
    });
    return after(function() {
      view.undelegateEvents();
      view.stopListening();
      return fixtures.cleanUp();
    });
  });
});
