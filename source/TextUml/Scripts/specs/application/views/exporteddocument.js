define(function(require) {
  var $, ExportedDocument, events;

  $ = require('jquery');
  ExportedDocument = require('../../../application/views/exporteddocument');
  events = require('../../../application/events');
  return describe('views/exporteddocument', function() {
    var spiedListenTo, view;

    view = null;
    spiedListenTo = null;
    before(function() {
      spiedListenTo = sinon.spy(ExportedDocument.prototype, 'listenTo');
      fixtures.set("<div id=\"exported-document-dialog\">\n  <img style=\"display:none\"/>\n</div>");
      return view = new ExportedDocument({
        el: $(fixtures.window().document.body).find('#exported-document-dialog')
      });
    });
    describe('new', function() {
      it('is a modal dialog', function() {
        return expect(view.$el.data('modal')).to.be.ok;
      });
      return it('subscribes to documentExported application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'documentExported', view.onDocumentExported);
      });
    });
    describe('#onDocumentExported', function() {
      var stubbedImageProp, stubbedModal;

      stubbedModal = null;
      stubbedImageProp = null;
      before(function() {
        stubbedModal = sinon.stub(view.$el, 'modal', function() {});
        stubbedImageProp = sinon.stub(view.image, 'prop', function() {});
        return view.onDocumentExported({
          data: '/Content/images/spacer.gif'
        });
      });
      it('shows modal dialog', function() {
        return expect(stubbedModal).to.have.calledWith('show');
      });
      it('sets image src', function() {
        return expect(stubbedImageProp).to.have.calledWith('src', '/Content/images/spacer.gif');
      });
      return after(function() {
        stubbedImageProp.restore();
        return stubbedImageProp.restore();
      });
    });
    describe('#onDialogShown', function() {
      var stubbedFadeIn;

      stubbedFadeIn = null;
      before(function() {
        stubbedFadeIn = sinon.stub(view.messageBox, 'fadeIn', function() {});
        return view.onDialogShown();
      });
      it('fade ins the message box', function() {
        return expect(stubbedFadeIn).to.have.been.calledWith(sinon.match.number);
      });
      return after(function() {
        return stubbedFadeIn.restore();
      });
    });
    describe('#onDialogHide', function() {
      var stubbedHide;

      stubbedHide = null;
      before(function() {
        stubbedHide = sinon.stub(view.messageBox, 'hide', function() {});
        return view.onDialogHide();
      });
      it('hides the message box', function() {
        return expect(stubbedHide).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedHide.restore();
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
