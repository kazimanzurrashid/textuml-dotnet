define(function(require) {
  var $, Membership, events;

  $ = require('jquery');
  Membership = require('../../../application/views/membership');
  events = require('../../../application/events');
  return describe('views/membership', function() {
    var originalForgotPasswordViewType, originalSignInViewType, originalSignUpViewType, spiedListenTo, view;

    originalSignInViewType = null;
    originalForgotPasswordViewType = null;
    originalSignUpViewType = null;
    spiedListenTo = null;
    view = null;
    before(function() {
      originalSignInViewType = Membership.prototype.signInViewType;
      originalForgotPasswordViewType = Membership.prototype.forgotPasswordViewType;
      originalSignUpViewType = Membership.prototype.signUpViewType;
      Membership.prototype.signInViewType = sinon.stub().returns({});
      Membership.prototype.forgotPasswordViewType = sinon.stub().returns({});
      Membership.prototype.signUpViewType = sinon.stub().returns({});
      spiedListenTo = sinon.spy(Membership.prototype, 'listenTo');
      fixtures.set('<div id="membership-dialog"></div>');
      return view = new Membership({
        el: $(fixtures.window().document.body).find('#membership-dialog')
      });
    });
    describe('new', function() {
      it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
      it('creates sign-in view', function() {
        return expect(view.signIn).to.be.ok;
      });
      it('creates forgot password view', function() {
        return expect(view.forgotPassword).to.be.ok;
      });
      it('creates sign-up view', function() {
        return expect(view.signUp).to.be.ok;
      });
      it('subscribes to showMembership application event', function() {
        return expect(spiedListenTo).to.be.have.been.calledWith(events, 'showMembership', view.onShowMembership);
      });
      return it('subscribes to signedIn passwordResetTokenRequested and signedUp application events', function() {
        return expect(spiedListenTo).to.be.have.been.calledWith(events, 'signedIn passwordResetTokenRequested signedUp', view.onSignedInOrPasswordResetTokenRequestedOrSignedUp);
      });
    });
    describe('#onShowMembership', function() {
      var cancelCallback, okCallback, originalCancelCallback, originalOkCallback, stubbedFirstTabTrigger, stubbedModal;

      originalCancelCallback = null;
      originalOkCallback = null;
      okCallback = null;
      cancelCallback = null;
      stubbedFirstTabTrigger = null;
      stubbedModal = null;
      before(function() {
        originalCancelCallback = view.cancel;
        originalOkCallback = view.ok;
        okCallback = function() {};
        cancelCallback = function() {};
        stubbedFirstTabTrigger = sinon.stub(view.firstTabHead, 'trigger', function() {});
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        return view.onShowMembership({
          ok: okCallback,
          cancel: cancelCallback
        });
      });
      it('sets #ok callback', function() {
        return expect(view.ok).to.deep.equal(okCallback);
      });
      it('sets #cancel callback', function() {
        return expect(view.cancel).to.deep.equal(cancelCallback);
      });
      it('switched to first tab', function() {
        return expect(stubbedFirstTabTrigger).to.have.been.calledWith('click');
      });
      it('shows modal dialog', function() {
        return expect(stubbedModal).to.have.been.calledWith('show');
      });
      return after(function() {
        view.ok = originalOkCallback;
        view.cancel = originalCancelCallback;
        stubbedFirstTabTrigger.restore();
        return stubbedModal.restore();
      });
    });
    describe('onSignedInOrPasswordResetTokenRequestedOrSignedUp', function() {
      var originalCanceled, stubbedModal;

      originalCanceled = null;
      stubbedModal = null;
      before(function() {
        originalCanceled = view.canceled;
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        return view.onSignedInOrPasswordResetTokenRequestedOrSignedUp();
      });
      it('sets #canceled to false', function() {
        return expect(view.canceled).to.be["false"];
      });
      it('hides modal dialog', function() {
        return expect(stubbedModal).to.have.been.calledWith('hide');
      });
      return after(function() {
        view.canceled = originalCanceled;
        return stubbedModal.restore();
      });
    });
    describe('#onTabHeaderShown', function() {
      var spiedPutFocus, stubbedSelector;

      stubbedSelector = null;
      spiedPutFocus = null;
      before(function() {
        var match;

        match = {
          putFocus: function() {}
        };
        spiedPutFocus = sinon.spy(match, 'putFocus');
        stubbedSelector = sinon.stub(view, '$', function() {
          return match;
        });
        return view.onTabHeaderShown({
          target: {
            hash: '#tab1'
          }
        });
      });
      it('puts focus on the selected tab', function() {
        return expect(spiedPutFocus).to.have.been.calledOnce;
      });
      return after(function() {
        spiedPutFocus.restore();
        return stubbedSelector.restore();
      });
    });
    describe('#onDialogShow', function() {
      var originalCanceled, stubbedHideFieldErrors, stubbedHideSummaryError, stubbedResetFields;

      stubbedResetFields = null;
      stubbedHideSummaryError = null;
      stubbedHideFieldErrors = null;
      originalCanceled = null;
      before(function() {
        stubbedResetFields = sinon.stub(view.$el, 'resetFields', function() {
          return view.$el;
        });
        stubbedHideSummaryError = sinon.stub(view.$el, 'hideSummaryError', function() {
          return view.$el;
        });
        stubbedHideFieldErrors = sinon.stub(view.$el, 'hideFieldErrors', function() {
          return view.$el;
        });
        originalCanceled = view.canceled;
        view.canceled = false;
        return view.onDialogShow();
      });
      it('sets #canceled to true', function() {
        return expect(view.canceled).to.be["true"];
      });
      it('resets fields', function() {
        return expect(stubbedResetFields).to.have.been.calledOnce;
      });
      it('hides summary error', function() {
        return expect(stubbedHideSummaryError).to.have.been.calledOnce;
      });
      it('hides field errors', function() {
        return expect(stubbedHideFieldErrors).to.have.been.calledOnce;
      });
      return after(function() {
        view.canceled = originalCanceled;
        stubbedResetFields.reset();
        stubbedHideSummaryError.reset();
        return stubbedHideFieldErrors.reset();
      });
    });
    describe('#onDialogShown', function() {
      var stubbedPutFocus;

      stubbedPutFocus = null;
      before(function() {
        stubbedPutFocus = sinon.stub(view.$el, 'putFocus', function() {});
        return view.onDialogShown();
      });
      it('puts focus', function() {
        return expect(stubbedPutFocus).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedPutFocus.restore();
      });
    });
    describe('#onDialogHidden', function() {
      describe('cancel', function() {
        var cancelCalled, originalCancelCallback, originalCanceled;

        originalCanceled = null;
        originalCancelCallback = null;
        cancelCalled = null;
        before(function() {
          originalCanceled = view.canceled;
          originalCancelCallback = view.cancel;
          cancelCalled = false;
          view.canceled = true;
          view.cancel = function() {
            return cancelCalled = true;
          };
          return view.onDialogHidden();
        });
        it('executes #cancel callback', function() {
          return expect(cancelCalled).to.be["true"];
        });
        return after(function() {
          view.canceled = originalCanceled;
          return view.cancel = originalCancelCallback;
        });
      });
      return describe('ok', function() {
        var okCalled, originalCanceled, originalOkCallback;

        originalCanceled = null;
        originalOkCallback = null;
        okCalled = null;
        before(function() {
          originalCanceled = view.canceled;
          originalOkCallback = view.ok;
          okCalled = false;
          view.canceled = false;
          view.ok = function() {
            return okCalled = true;
          };
          return view.onDialogHidden();
        });
        it('executes #ok callback', function() {
          return expect(okCalled).to.be["true"];
        });
        return after(function() {
          view.canceled = originalCanceled;
          return view.ok = originalOkCallback;
        });
      });
    });
    return after(function() {
      view.undelegateEvents();
      view.stopListening();
      Membership.prototype.signInViewType = originalSignInViewType;
      Membership.prototype.forgotPasswordViewType = originalForgotPasswordViewType;
      Membership.prototype.signUpViewType = originalSignUpViewType;
      spiedListenTo.restore();
      return fixtures.cleanUp();
    });
  });
});
