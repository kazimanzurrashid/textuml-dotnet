define (require) ->
  $             = require 'jquery'
  Membership    = require '../../../application/views/membership'
  events        = require '../../../application/events'

  describe 'views/membership', ->
    view = null

    before ->
      fixtures.set '<div id="membership-dialog"></div>'

      view = new Membership
        el: $(fixtures.window().document.body).find '#membership-dialog'

    describe 'child views', ->
      it 'creates sign-in view', -> expect(view.signIn).to.be.ok

      it 'creates forgot password view', ->
        expect(view.forgotPassword).to.be.ok

      it 'creates sign-up view', -> expect(view.signUp).to.be.ok

    describe 'plug-in integrations', ->
      it 'is a modal dialog', -> expect(view.$el.data 'modal').to.be.ok

    describe 'dialog closing without application events', ->
      cancelCalled = null

      before (done) ->
        view.$el.on 'hidden', -> done()

        events.trigger 'showMembership', cancel: -> cancelCalled = true
        view.$el.modal 'hide'

      it 'executes #cancel callback', -> expect(cancelCalled).to.be.ok

    describe 'application events', -> 
    
      describe 'showMembership triggered', ->
        visible           = null
        okCallback        = null
        cancelCallback    = null

        before (done) ->
          visible         = false
          okCallback      = ->
          cancelCallback  = ->

          view.$el.on 'shown', ->
            visible = true
            done()

          events.trigger 'showMembership',
            ok: okCallback
            cancel: cancelCallback

        it 'becomes visible', -> expect(visible).to.be.ok

        it 'sets #ok callback', -> expect(view.ok).to.deep.equal okCallback

        it 'sets #cancel callback', ->
          expect(view.cancel).to.deep.equal cancelCallback

        it 'sets #canceled to false', -> expect(view.canceled).to.be.ok

        after -> view.$el.modal 'hide'

      describe 'done events', ->

        behavesLikeDone = =>
          it 'becomes hidden', => expect(@hidden).to.be.true

          it 'executes #ok callback', => expect(@okCalled).to.be.true

          it 'sets #canceled to false', =>
            expect(view.canceled).to.be.false

        before (done) =>
          @hidden = false
          @okCalled = false

          view.$el.on 'hidden', =>
            @hidden = true
            done()

          events.trigger 'showMembership', ok: => this.okCalled = true
          events.trigger 'signedIn'

        describe 'signedIn triggered', ->
          before -> events.trigger 'signedIn'

          behavesLikeDone()

        describe 'passwordResetRequested triggered', ->
          before -> events.trigger 'passwordResetRequested'

          behavesLikeDone()

        describe 'signedUp triggered', ->
          before -> events.trigger 'signedUp'

          behavesLikeDone()

    after -> fixtures.cleanUp()