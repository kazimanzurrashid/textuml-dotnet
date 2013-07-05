
define(function(require) {
  var $, DocumentBrowser, events;
  $ = require('jquery');
  DocumentBrowser = require('../../../application/views/documentbrowser');
  events = require('../../../application/events');
  return describe('views/documentbrowser', function() {
    var context, originalListViewType, spiedListenTo, view;
    originalListViewType = null;
    context = null;
    spiedListenTo = null;
    view = null;
    before(function() {
      var stubbedListViewType;
      fixtures.set("<div id=\"document-browser-dialog\">\n  <button type=\"button\" class=\"btn btn-primary\">Open</button>\n</div>");
      stubbedListViewType = sinon.stub().returns({
        on: function() {},
        off: function() {},
        scrollToTop: function() {},
        resetSelection: function() {},
        getSelectedId: function() {}
      });
      originalListViewType = DocumentBrowser.prototype.listViewType;
      DocumentBrowser.prototype.listViewType = stubbedListViewType;
      context = sinon.stub({
        documents: []
      });
      spiedListenTo = sinon.spy(DocumentBrowser.prototype, 'listenTo');
      return view = new DocumentBrowser({
        el: $(fixtures.window().document.body).find('#document-browser-dialog'),
        context: context
      });
    });
    describe('new', function() {
      it('creates document list', function() {
        return expect(view.list).to.exist;
      });
      it('subscribes to document list selected event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(view.list, 'selected');
      });
      it('subscribes to document list opened event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(view.list, 'opened');
      });
      it('subscribes to showDocuments application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'showDocuments');
      });
      return it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
    });
    describe('#onShowDocuments', function() {
      var cancelCallback, originalCancelCallback, stubbedModal;
      originalCancelCallback = null;
      stubbedModal = null;
      cancelCallback = null;
      before(function() {
        originalCancelCallback = view.cancel;
        cancelCallback = function() {};
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        return view.onShowDocuments({
          cancel: cancelCallback
        });
      });
      it('sets cancel callback', function() {
        return expect(view.cancel).to.deep.equal(cancelCallback);
      });
      it('shows modal dialog', function() {
        return expect(stubbedModal).to.have.been.calledWith('show');
      });
      return after(function() {
        view.cancel = originalCancelCallback;
        return stubbedModal.restore();
      });
    });
    describe('#onDiaglogShow', function() {
      var originalCanceled, stubbedResetSelection, stubbedScrollToTop, stubbedSetProperty;
      originalCanceled = null;
      stubbedScrollToTop = null;
      stubbedResetSelection = null;
      stubbedSetProperty = null;
      before(function() {
        originalCanceled = view.canceled;
        stubbedScrollToTop = sinon.stub(view.list, 'scrollToTop', function() {});
        stubbedResetSelection = sinon.stub(view.list, 'resetSelection', function() {});
        stubbedSetProperty = sinon.stub(view.submitButton, 'prop', function() {});
        return view.onDiaglogShow();
      });
      it('sets #canceled to true', function() {
        return expect(view.canceled).to["true"];
      });
      it('scrolls list to top', function() {
        return expect(stubbedScrollToTop).to.have.been.calledOnce;
      });
      it('resets current selection', function() {
        return expect(stubbedResetSelection).to.have.been.calledOnce;
      });
      it('disables submit button', function() {
        return expect(stubbedSetProperty).to.have.been.calledWith('disabled', true);
      });
      return after(function() {
        view.canceled = originalCanceled;
        stubbedScrollToTop.restore();
        stubbedResetSelection.restore();
        return stubbedSetProperty.restore();
      });
    });
    describe('#onDialogHidden', function() {
      var cancelCalled, originalCancelCallback, originalCanceled;
      originalCanceled = null;
      originalCancelCallback = null;
      cancelCalled = null;
      before(function() {
        var originalcancelCallback;
        originalCanceled = view.canceled;
        originalcancelCallback = view.cancel;
        return view.cancel = function() {
          return cancelCalled = true;
        };
      });
      describe('#canceled is true', function() {
        before(function() {
          cancelCalled = false;
          view.canceled = true;
          return view.onDialogHidden();
        });
        return it('executes cancel callback', function() {
          return expect(cancelCalled).to.be["true"];
        });
      });
      describe('#canceled is false', function() {
        before(function() {
          cancelCalled = false;
          view.canceled = false;
          return view.onDialogHidden();
        });
        return it('does not execute cancel callback', function() {
          return expect(cancelCalled).to.be["false"];
        });
      });
      return after(function() {
        view.canceled = originalCanceled;
        return view.cancel = originalCancelCallback;
      });
    });
    describe('#onDocumentSelected', function() {
      var stubbedSetProperty;
      stubbedSetProperty = null;
      before(function() {
        stubbedSetProperty = sinon.stub(view.submitButton, 'prop', function() {});
        return view.onDocumentSelected();
      });
      it('enables submit button', function() {
        return expect(stubbedSetProperty).to.have.been.calledWith('disabled', false);
      });
      return after(function() {
        return stubbedSetProperty.restore();
      });
    });
    describe('#onDocumentOpened', function() {
      var stubbedTrigger;
      stubbedTrigger = null;
      before(function() {
        stubbedTrigger = sinon.stub(view.submitButton, 'trigger', function() {});
        return view.onDocumentOpened();
      });
      it('triggers submit button click', function() {
        return expect(stubbedTrigger).to.have.been.calledWith('click');
      });
      return after(function() {
        return stubbedTrigger.restore();
      });
    });
    describe('#onSubmit', function() {
      var originalCanceled, stubbedEventsTrigger, stubbedGetId, stubbedModal;
      originalCanceled = null;
      stubbedModal = null;
      stubbedGetId = null;
      stubbedEventsTrigger = null;
      before(function() {
        originalCanceled = view.canceled;
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        stubbedGetId = sinon.stub(view.list, 'getSelectedId', function() {
          return 1;
        });
        stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
        return view.onSubmit({
          preventDefault: function() {}
        });
      });
      it('sets #canceled to false', function() {
        return expect(view.canceled).to.be["false"];
      });
      it('sets hides modal dialog', function() {
        return expect(stubbedModal).to.have.been.calledWith('hide');
      });
      it('triggers documentSelected application event', function() {
        return expect(stubbedEventsTrigger).to.have.been.calledWith('documentSelected', {
          id: 1
        });
      });
      return after(function() {
        view.canceled = originalCanceled;
        stubbedModal.restore();
        stubbedGetId.restore();
        return stubbedEventsTrigger.restore();
      });
    });
    return after(function() {
      view.undelegateEvents();
      view.stopListening();
      DocumentBrowser.prototype.listViewType = originalListViewType;
      return fixtures.cleanUp();
    });
  });
});
