define (require) ->
  $             = require 'jquery'
  Membership    = require '../../../application/views/membership'
  events        = require '../../../application/events'

  describe 'views/membership', ->
    originalSignInViewType            = null
    originalForgotPasswordViewType    = null
    originalSignUpViewType            = null
    spiedListenTo                     = null
    view                              = null

    before ->
      originalSignInViewType                = Membership::signInViewType
      originalForgotPasswordViewType        = Membership::forgotPasswordViewType
      originalSignUpViewType                = Membership::signUpViewType
      Membership::signInViewType            = sinon.stub().returns {}
      Membership::forgotPasswordViewType    = sinon.stub().returns {}
      Membership::signUpViewType            = sinon.stub().returns {}
      spiedListenTo                         = sinon.spy Membership.prototype, 'listenTo'

      fixtures.set '<div id="membership-dialog"></div>'

      view = new Membership
        el: $(fixtures.window().document.body).find '#membership-dialog'

    describe 'new', ->
      it 'is a modal dialog', -> expect(view.$el.data 'modal').to.be.ok

      it 'creates sign-in view', -> expect(view.signIn).to.be.ok

      it 'creates forgot password view', ->
        expect(view.forgotPassword).to.be.ok

      it 'creates sign-up view', -> expect(view.signUp).to.be.ok

      it 'subscribes to showMembership application event', -> 
        expect(spiedListenTo)
          .to.be.have.been.calledWith events,
            'showMembership',
            view.onShowMembership

      it 'subscribes to signedIn passwordResetTokenRequested and signedUp application events', -> 
        expect(spiedListenTo)
          .to.be.have.been.calledWith events,
            'signedIn passwordResetTokenRequested signedUp',
            view.onSignedInOrPasswordResetTokenRequestedOrSignedUp

    describe '#onShowMembership', ->
      originalCancelCallback    = null
      originalOkCallback        = null
      okCallback                = null
      cancelCallback            = null
      stubbedFirstTabTrigger    = null
      stubbedModal              = null

      before ->
        originalCancelCallback    = view.cancel
        originalOkCallback        = view.ok
        okCallback                = ->
        cancelCallback            = ->
        stubbedFirstTabTrigger    = sinon.stub view.firstTabHead, 'trigger', ->
        stubbedModal              = sinon.stub view.$el, 'modal', ->

        view.onShowMembership
          ok        : okCallback
          cancel    : cancelCallback

      it 'sets #ok callback', -> expect(view.ok).to.deep.equal okCallback

      it 'sets #cancel callback', ->
        expect(view.cancel).to.deep.equal cancelCallback

      it 'switched to first tab', ->
        expect(stubbedFirstTabTrigger).to.have.been.calledWith 'click'

      it 'shows modal dialog', ->
        expect(stubbedModal).to.have.been.calledWith 'show'

      after ->
       view.ok          = originalOkCallback
       view.cancel      = originalCancelCallback
       stubbedFirstTabTrigger.restore()
       stubbedModal.restore()

    describe 'onSignedInOrPasswordResetTokenRequestedOrSignedUp', ->
      originalCanceled  = null
      stubbedModal      = null

      before ->
        originalCanceled  = view.canceled
        stubbedModal      = sinon.stub view.$el, 'modal', ->
        view.onSignedInOrPasswordResetTokenRequestedOrSignedUp()

      it 'sets #canceled to false', -> expect(view.canceled).to.be.false

      it 'hides modal dialog', ->
        expect(stubbedModal).to.have.been.calledWith 'hide'

      after ->
        view.canceled = originalCanceled
        stubbedModal.restore()

    describe '#onTabHeaderShown', ->
      stubbedSelector   = null
      spiedPutFocus     = null

      before -> 
        match               = putFocus: ->
        spiedPutFocus       = sinon.spy match, 'putFocus'
        stubbedSelector     = sinon.stub view, '$', -> match

        view.onTabHeaderShown target: { hash: '#tab1' }

      it 'puts focus on the selected tab', ->
        expect(spiedPutFocus).to.have.been.calledOnce

      after ->
        spiedPutFocus.restore()
        stubbedSelector.restore()

    describe '#onDialogShow', ->
      stubbedResetFields          = null
      stubbedHideSummaryError     = null
      stubbedHideFieldErrors      = null
      originalCanceled            = null

      before ->
        stubbedResetFields        = sinon.stub view.$el, 'resetFields', -> view.$el
        stubbedHideSummaryError   = sinon.stub view.$el, 'hideSummaryError', -> view.$el
        stubbedHideFieldErrors    = sinon.stub view.$el, 'hideFieldErrors', -> view.$el

        originalCanceled = view.canceled
        view.canceled = false

        view.onDialogShow()

      it 'sets #canceled to true', -> expect(view.canceled).to.be.true

      it 'resets fields', -> expect(stubbedResetFields).to.have.been.calledOnce

      it 'hides summary error', -> expect(stubbedHideSummaryError).to.have.been.calledOnce

      it 'hides field errors', -> expect(stubbedHideFieldErrors).to.have.been.calledOnce

      after ->
        view.canceled = originalCanceled
        stubbedResetFields.reset()
        stubbedHideSummaryError.reset()
        stubbedHideFieldErrors.reset()

    describe '#onDialogShown', ->
      stubbedPutFocus     = null

      before ->
        stubbedPutFocus = sinon.stub view.$el, 'putFocus', ->
        view.onDialogShown()

      it 'puts focus', -> expect(stubbedPutFocus).to.have.been.calledOnce

      after -> stubbedPutFocus.restore()

    describe '#onDialogHidden', ->

      describe 'cancel', ->
        originalCanceled          = null
        originalCancelCallback    = null
        cancelCalled              = null

        before ->
          originalCanceled          = view.canceled
          originalCancelCallback    = view.cancel
          cancelCalled              = false
          view.canceled             = true
          view.cancel               = -> cancelCalled = true

          view.onDialogHidden()

        it 'executes #cancel callback', -> expect(cancelCalled).to.be.true

        after ->
         view.canceled    = originalCanceled
         view.cancel      = originalCancelCallback

      describe 'ok', ->
        originalCanceled      = null
        originalOkCallback    = null
        okCalled              = null

        before ->
          originalCanceled      = view.canceled
          originalOkCallback    = view.ok
          okCalled              = false
          view.canceled         = false
          view.ok               = -> okCalled = true

          view.onDialogHidden()

        it 'executes #ok callback', -> expect(okCalled).to.be.true

        after ->
         view.canceled    = originalCanceled
         view.ok          = originalOkCallback

    after ->
      view.undelegateEvents()
      view.stopListening()
      Membership::signInViewType            = originalSignInViewType
      Membership::forgotPasswordViewType    = originalForgotPasswordViewType
      Membership::signUpViewType            = originalSignUpViewType
      spiedListenTo.restore()
      fixtures.cleanUp()