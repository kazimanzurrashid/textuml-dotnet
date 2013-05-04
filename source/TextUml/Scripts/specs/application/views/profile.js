define(function(require) {
  var $, Helpers, Profile, events;

  $ = require('jquery');
  Profile = require('../../../application/views/profile');
  Helpers = require('../../../application/views/helpers');
  events = require('../../../application/events');
  return describe('views/profile', function() {
    var spiedListenTo, view;

    spiedListenTo = null;
    view = null;
    before(function() {
      fixtures.set("<div id=\"profile-dialog\">\n  <form action=\"#\"></form>\n  <a id=\"sign-out-button\" href=\"javascript:;\">sign out</a>\n</div>");
      spiedListenTo = sinon.spy(Profile.prototype, 'listenTo');
      return view = new Profile({
        el: $(fixtures.window().document.body).find('#profile-dialog')
      });
    });
    describe('new', function() {
      it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
      return it('subscribes to showProfile application event', function() {
        return expect(spiedListenTo).to.be.have.been.calledWith(events, 'showProfile', view.onShowProfile);
      });
    });
    describe('#onShowProfile', function() {
      var stubbedHideFieldErrors, stubbedHideSummaryError, stubbedModal, stubbedResetFields;

      stubbedResetFields = null;
      stubbedHideSummaryError = null;
      stubbedHideFieldErrors = null;
      stubbedModal = null;
      before(function() {
        stubbedResetFields = sinon.stub(view.changePasswordForm, 'resetFields', function() {
          return view.changePasswordForm;
        });
        stubbedHideSummaryError = sinon.stub(view.changePasswordForm, 'hideSummaryError', function() {
          return view.changePasswordForm;
        });
        stubbedHideFieldErrors = sinon.stub(view.changePasswordForm, 'hideFieldErrors', function() {
          return view.changePasswordForm;
        });
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        return view.onShowProfile();
      });
      it('resets forms fields', function() {
        return expect(stubbedResetFields).to.have.been.calledOnce;
      });
      it('hides form errors', function() {
        return expect(stubbedHideSummaryError).to.have.been.calledOnce;
      });
      it('hides field errors', function() {
        return expect(stubbedHideFieldErrors).to.have.been.calledOnce;
      });
      it('shows modal dialog', function() {
        return expect(stubbedModal).to.been.calledWith('show');
      });
      return after(function() {
        stubbedResetFields.restore();
        stubbedHideSummaryError.restore();
        stubbedHideFieldErrors.restore();
        return stubbedModal.restore();
      });
    });
    describe('#onDialogShown', function() {
      var spiedPutFocus;

      spiedPutFocus = null;
      before(function() {
        spiedPutFocus = sinon.spy(view.changePasswordForm, 'putFocus');
        return view.onDialogShown();
      });
      it('puts focus on form', function() {
        return expect(spiedPutFocus).to.have.been.calledOnce;
      });
      return after(function() {
        return spiedPutFocus.restore();
      });
    });
    describe('#onChangePassword', function() {
      var model, stubbedHideFieldErrors, stubbedHideSummaryError, stubbedModel, stubbedSerializeFields, stubbedSubscribeModelInvalidEvent;

      stubbedHideSummaryError = null;
      stubbedHideFieldErrors = null;
      stubbedSubscribeModelInvalidEvent = null;
      stubbedSerializeFields = null;
      model = null;
      stubbedModel = null;
      before(function() {
        stubbedHideSummaryError = sinon.stub(view.changePasswordForm, 'hideSummaryError', function() {
          return view.changePasswordForm;
        });
        stubbedHideFieldErrors = sinon.stub(view.changePasswordForm, 'hideFieldErrors', function() {
          return view.changePasswordForm;
        });
        stubbedSubscribeModelInvalidEvent = sinon.stub(Helpers, 'subscribeModelInvalidEvent', function() {});
        stubbedSerializeFields = sinon.stub(view.changePasswordForm, 'serializeFields', function() {
          return {};
        });
        model = {
          once: function() {},
          save: function() {}
        };
        stubbedModel = sinon.stub(Backbone, 'Model').returns(model);
        return view.changePasswordType = Backbone.Model;
      });
      describe('form submit', function() {
        var spiedSave;

        spiedSave = null;
        before(function() {
          spiedSave = sinon.spy(model, 'save');
          return view.onChangePassword({
            preventDefault: function() {}
          });
        });
        it('hides form errors', function() {
          return expect(stubbedHideSummaryError).to.have.been.called;
        });
        it('hides field errors', function() {
          return expect(stubbedHideFieldErrors).to.have.been.called;
        });
        it('creates ChangePassword as model', function() {
          return expect(stubbedModel).to.have.been.called;
        });
        it('subscribes to model invalid event once', function() {
          return expect(stubbedSubscribeModelInvalidEvent).to.have.been.calledWith(model, view.changePasswordForm);
        });
        it('serializes form fields', function() {
          return expect(stubbedSerializeFields).to.have.been.called;
        });
        it('saves model', function() {
          return expect(spiedSave).to.have.been.calledOnce;
        });
        return after(function() {
          return spiedSave.restore();
        });
      });
      describe('persistence', function() {
        describe('success', function() {
          var stubbedEventsTrigger, stubbedModal, stubbedSave;

          stubbedSave = null;
          stubbedModal = null;
          stubbedEventsTrigger = null;
          before(function() {
            stubbedSave = sinon.stub(model, 'save').yieldsTo('success');
            stubbedModal = sinon.stub(view.$el, 'modal', function() {});
            stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
            return view.onChangePassword({
              preventDefault: function() {}
            });
          });
          it('hides the modal dialog', function() {
            return expect(stubbedModal).to.have.been.calledWith('hide');
          });
          it('triggers passwordChanged application event', function() {
            return expect(stubbedEventsTrigger).to.have.been.calledWith('passwordChanged');
          });
          return after(function() {
            stubbedSave.restore();
            stubbedModal.restore();
            return stubbedEventsTrigger.restore();
          });
        });
        return describe('error', function() {
          describe('client error', function() {
            var stubbedGetModelErrors, stubbedHasModelErrors, stubbedSave, stubbedShowFieldErrors;

            stubbedHasModelErrors = null;
            stubbedGetModelErrors = null;
            stubbedShowFieldErrors = null;
            stubbedSave = null;
            before(function() {
              stubbedHasModelErrors = sinon.stub(Helpers, 'hasModelErrors', function() {
                return true;
              });
              stubbedGetModelErrors = sinon.stub(Helpers, 'getModelErrors', function() {
                return {};
              });
              stubbedShowFieldErrors = sinon.stub(view.changePasswordForm, 'showFieldErrors', function() {});
              stubbedSave = sinon.stub(model, 'save').yieldsTo('error');
              return view.onChangePassword({
                preventDefault: function() {}
              });
            });
            it('shows field errors', function() {
              return expect(stubbedShowFieldErrors).to.have.been.calledOnce;
            });
            return after(function() {
              stubbedHasModelErrors.restore();
              stubbedGetModelErrors.restore();
              stubbedShowFieldErrors.restore();
              return stubbedSave.restore();
            });
          });
          return describe('unknown error', function() {
            var stubbedHasModelErrors, stubbedSave, stubbedShowSummaryError;

            stubbedHasModelErrors = null;
            stubbedShowSummaryError = null;
            stubbedSave = null;
            before(function() {
              stubbedHasModelErrors = sinon.stub(Helpers, 'hasModelErrors', function() {
                return false;
              });
              stubbedShowSummaryError = sinon.stub(view.changePasswordForm, 'showSummaryError', function() {});
              stubbedSave = sinon.stub(model, 'save').yieldsTo('error');
              return view.onChangePassword({
                preventDefault: function() {}
              });
            });
            it('shows summary error', function() {
              return expect(stubbedShowSummaryError).to.have.been.calledOnce;
            });
            return after(function() {
              stubbedHasModelErrors.restore();
              stubbedShowSummaryError.restore();
              return stubbedSave.restore();
            });
          });
        });
      });
      return after(function() {
        stubbedHideSummaryError.restore();
        stubbedHideFieldErrors.restore();
        stubbedSubscribeModelInvalidEvent.restore();
        stubbedSerializeFields.restore();
        return stubbedModel.restore();
      });
    });
    describe('#onSignOut', function() {
      describe('submit', function() {
        var stubbedConfirm, stubbedModalHide;

        stubbedModalHide = null;
        stubbedConfirm = null;
        before(function() {
          stubbedModalHide = sinon.stub(view.$el, 'modal', function() {});
          stubbedConfirm = sinon.stub($, 'confirm', function() {});
          return view.onSignOut({
            preventDefault: function() {}
          });
        });
        it('hides the modal dialog', function() {
          return expect(stubbedModalHide).to.have.been.calledWith('hide');
        });
        it('asks for confirmation', function() {
          return expect(stubbedConfirm).to.have.been.calledOnce;
        });
        return after(function() {
          stubbedModalHide.restore();
          return stubbedConfirm.restore();
        });
      });
      return describe('confirmed', function() {
        var stubbedConfirm, stubbedEventsTrigger, stubbedModalHide, stubbedModel;

        stubbedModalHide = null;
        stubbedConfirm = null;
        stubbedModel = null;
        stubbedEventsTrigger = null;
        before(function() {
          var model;

          stubbedModalHide = sinon.stub(view.$el, 'modal', function() {});
          stubbedConfirm = sinon.stub($, 'confirm').yieldsTo('ok');
          model = {
            destroy: function() {}
          };
          stubbedModel = sinon.stub(Backbone, 'Model').returns(model);
          view.sessionType = Backbone.Model;
          sinon.stub(model, 'destroy').yieldsTo('success');
          stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
          return view.onSignOut({
            preventDefault: function() {}
          });
        });
        it('triggers signedOut application event', function() {
          return expect(stubbedEventsTrigger).to.have.been.calledWith('signedOut');
        });
        return after(function() {
          stubbedModalHide.restore();
          stubbedConfirm.restore();
          stubbedEventsTrigger.restore();
          return stubbedModel.restore();
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
