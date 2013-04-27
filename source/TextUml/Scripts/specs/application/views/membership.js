
define(function(require) {
  var $, Membership, events;
  $ = require('jquery');
  Membership = require('../../../application/views/membership');
  events = require('../../../application/events');
  return describe('views/membership', function() {
    var view;
    view = null;
    before(function() {
      fixtures.set('<div id="membership-dialog"></div>');
      return view = new Membership({
        el: $(fixtures.window().document.body).find('#membership-dialog')
      });
    });
    describe('child views', function() {
      it('creates sign-in view', function() {
        return expect(view.signIn).to.be.ok;
      });
      it('creates forgot password view', function() {
        return expect(view.forgotPassword).to.be.ok;
      });
      return it('creates sign-up view', function() {
        return expect(view.signUp).to.be.ok;
      });
    });
    describe('plug-in integrations', function() {
      return it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
    });
    describe('dialog closing without application events', function() {
      var cancelCalled;
      cancelCalled = null;
      before(function(done) {
        view.$el.on('hidden', function() {
          return done();
        });
        events.trigger('showMembership', {
          cancel: function() {
            return cancelCalled = true;
          }
        });
        return view.$el.modal('hide');
      });
      return it('executes #cancel callback', function() {
        return expect(cancelCalled).to.be.ok;
      });
    });
    describe('application events', function() {
      describe('showMembership triggered', function() {
        var cancelCallback, okCallback, visible;
        visible = null;
        okCallback = null;
        cancelCallback = null;
        before(function(done) {
          visible = false;
          okCallback = function() {};
          cancelCallback = function() {};
          view.$el.on('shown', function() {
            visible = true;
            return done();
          });
          return events.trigger('showMembership', {
            ok: okCallback,
            cancel: cancelCallback
          });
        });
        it('becomes visible', function() {
          return expect(visible).to.be.ok;
        });
        it('sets #ok callback', function() {
          return expect(view.ok).to.deep.equal(okCallback);
        });
        it('sets #cancel callback', function() {
          return expect(view.cancel).to.deep.equal(cancelCallback);
        });
        it('sets #canceled to false', function() {
          return expect(view.canceled).to.be.ok;
        });
        return after(function() {
          return view.$el.modal('hide');
        });
      });
      return describe('done events', function() {
        var behavesLikeDone,
          _this = this;
        behavesLikeDone = function() {
          it('becomes hidden', function() {
            return expect(_this.hidden).to.be["true"];
          });
          it('executes #ok callback', function() {
            return expect(_this.okCalled).to.be["true"];
          });
          return it('sets #canceled to false', function() {
            return expect(view.canceled).to.be["false"];
          });
        };
        before(function(done) {
          _this.hidden = false;
          _this.okCalled = false;
          view.$el.on('hidden', function() {
            _this.hidden = true;
            return done();
          });
          events.trigger('showMembership', {
            ok: function() {
              return _this.okCalled = true;
            }
          });
          return events.trigger('signedIn');
        });
        describe('signedIn triggered', function() {
          before(function() {
            return events.trigger('signedIn');
          });
          return behavesLikeDone();
        });
        describe('passwordResetRequested triggered', function() {
          before(function() {
            return events.trigger('passwordResetRequested');
          });
          return behavesLikeDone();
        });
        return describe('signedUp triggered', function() {
          before(function() {
            return events.trigger('signedUp');
          });
          return behavesLikeDone();
        });
      });
    });
    return after(function() {
      return fixtures.cleanUp();
    });
  });
});
