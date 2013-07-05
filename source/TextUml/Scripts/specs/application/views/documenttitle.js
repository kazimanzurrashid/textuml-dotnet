
define(function(require) {
  var $, DocumentTitle, events;
  $ = require('jquery');
  DocumentTitle = require('../../../application/views/documenttitle');
  events = require('../../../application/events');
  return describe('views/documenttitle', function() {
    var context, spiedListenTo, view;
    context = null;
    spiedListenTo = null;
    view = null;
    before(function() {
      context = {
        getNewDocumentTitle: function() {},
        setCurrentDocumentTitle: function() {}
      };
      spiedListenTo = sinon.spy(DocumentTitle.prototype, 'listenTo');
      fixtures.set("<div id=\"document-title-dialog\">\n  <input type=\"text\" />\n  <button>save</button>\n</div>");
      return view = new DocumentTitle({
        el: $(fixtures.window().document.body).find('#document-title-dialog'),
        context: context
      });
    });
    describe('new', function() {
      it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
      return it('subscribes to showNewDocumentTitle application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'showNewDocumentTitle', view.onShowNewDocumentTitle);
      });
    });
    describe('#onShowNewDocumentTitle', function() {
      var stubbedGetTitle, stubbedModal, stubbedVal, title;
      title = 'test diagram';
      stubbedGetTitle = null;
      stubbedVal = null;
      stubbedModal = null;
      before(function() {
        stubbedGetTitle = sinon.stub(context, 'getNewDocumentTitle', function() {
          return title;
        });
        stubbedVal = sinon.stub(view.input, 'val', function() {});
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        return view.onShowNewDocumentTitle();
      });
      it('sets new document title', function() {
        return expect(stubbedVal).to.have.calledWith(title);
      });
      it('shows modal dialog', function() {
        return expect(stubbedModal).to.have.calledWith('show');
      });
      return after(function() {
        stubbedGetTitle.restore();
        stubbedVal.restore();
        return stubbedModal.restore();
      });
    });
    describe('#onDialogShow', function() {
      var stubbedHideFieldErrors;
      stubbedHideFieldErrors = null;
      before(function() {
        stubbedHideFieldErrors = sinon.stub(view.$el, 'hideFieldErrors', function() {});
        return view.onDialogShow();
      });
      it('hides field errors', function() {
        return expect(stubbedHideFieldErrors).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedHideFieldErrors.restore();
      });
    });
    describe('#onDiaglogShown', function() {
      var stubbedPutFocus;
      stubbedPutFocus = null;
      before(function() {
        stubbedPutFocus = sinon.stub(view.$el, 'putFocus', function() {});
        return view.onDiaglogShown();
      });
      it('puts focus to input', function() {
        return expect(stubbedPutFocus).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedPutFocus.restore();
      });
    });
    describe('#onSubmit', function() {
      describe('success', function() {
        var stubbedEventsTrigger, stubbedModal, stubbedSetTitle, stubbedVal, title;
        title = 'test diagram';
        stubbedVal = null;
        stubbedSetTitle = null;
        stubbedModal = null;
        stubbedEventsTrigger = null;
        before(function() {
          stubbedVal = sinon.stub(view.input, 'val', function() {
            return title;
          });
          stubbedSetTitle = sinon.stub(context, 'setCurrentDocumentTitle', function() {});
          stubbedModal = sinon.stub(view.$el, 'modal', function() {});
          stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
          return view.onSubmit({
            preventDefault: function() {}
          });
        });
        it('sets current document title', function() {
          return expect(stubbedSetTitle).to.have.been.calledWith(title);
        });
        it('hides modal dialog', function() {
          return expect(stubbedModal).to.have.been.calledWith('hide');
        });
        it('triggers newDocumentTitleAssigned application event', function() {
          return expect(stubbedEventsTrigger).to.have.been.calledWith('newDocumentTitleAssigned');
        });
        return after(function() {
          stubbedVal.restore();
          stubbedSetTitle.restore();
          stubbedModal.restore();
          return stubbedEventsTrigger.restore();
        });
      });
      return describe('error', function() {
        var stubbedShowFieldErrors, stubbedVal;
        stubbedVal = null;
        stubbedShowFieldErrors = null;
        before(function() {
          stubbedVal = sinon.stub(view.input, 'val', function() {
            return '';
          });
          stubbedShowFieldErrors = sinon.stub(view.$el, 'showFieldErrors', function() {});
          return view.onSubmit({
            preventDefault: function() {}
          });
        });
        it('shows field errors', function() {
          return expect(stubbedShowFieldErrors).to.have.been.calledOnce;
        });
        return after(function() {
          stubbedVal.restore();
          return stubbedShowFieldErrors.restore();
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
