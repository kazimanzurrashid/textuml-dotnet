
define(function(require) {
  var $, DocumentListItem;
  $ = require('jquery');
  DocumentListItem = require('../../../application/views/documentlistedititem');
  return describe('views/documentlistedititem', function() {
    var model, stubbedListenTo, stubbedTemplate, view;
    stubbedListenTo = null;
    stubbedTemplate = null;
    model = null;
    view = null;
    before(function() {
      stubbedListenTo = sinon.stub(DocumentListItem.prototype, 'listenTo', function() {});
      stubbedTemplate = sinon.stub();
      model = {
        toJSON: function() {},
        get: function(attr) {},
        save: function() {},
        destroy: function() {}
      };
      return view = new DocumentListItem({
        model: model,
        template: stubbedTemplate
      });
    });
    describe('new', function() {
      it('subscribes to model change event', function() {
        return expect(stubbedListenTo).to.have.been.calledWith(model, 'change', view.render);
      });
      return it('subscribes to model remove and destroy event', function() {
        return expect(stubbedListenTo).to.have.been.calledWith(model, 'remove destroy', view.remove);
      });
    });
    describe('#render', function() {
      var html, stubbedHtml, stubbedToJSON;
      html = '<li>test doc</li>';
      stubbedToJSON = null;
      stubbedHtml = null;
      before(function() {
        stubbedTemplate.returns(html);
        stubbedToJSON = sinon.stub(view.model, 'toJSON', function() {
          return {};
        });
        stubbedHtml = sinon.stub(view.$el, 'html', function() {});
        return view.render();
      });
      it('sets element html', function() {
        return expect(stubbedHtml).to.have.been.calledWith(html);
      });
      return after(function() {
        stubbedTemplate.reset();
        stubbedToJSON.restore();
        return stubbedHtml.restore();
      });
    });
    describe('#remove', function() {
      return describe('with notification', function() {
        var stubbedFadeOut, stubbedTrigger;
        stubbedTrigger = null;
        stubbedFadeOut = null;
        before(function() {
          stubbedTrigger = sinon.stub(view, 'trigger', function() {});
          stubbedFadeOut = sinon.stub(view.$el, 'fadeOut', function() {});
          return view.remove(true);
        });
        it('triggers removing event', function() {
          return expect(stubbedTrigger).to.have.been.calledWith('removing');
        });
        it('fade outs the element', function() {
          return expect(stubbedFadeOut).to.have.been.called;
        });
        return after(function() {
          stubbedTrigger.restore();
          return stubbedFadeOut.restore();
        });
      });
    });
    describe('#showDisplay', function() {
      var stubbedDisplay, stubbedEdit, stubbedSelector;
      stubbedSelector = null;
      stubbedEdit = null;
      stubbedDisplay = null;
      before(function() {
        var display, edit;
        edit = {
          hide: function() {}
        };
        display = {
          show: function() {}
        };
        stubbedEdit = sinon.stub(edit, 'hide', function() {});
        stubbedDisplay = sinon.stub(display, 'show', function() {});
        stubbedSelector = sinon.stub(view, '$');
        stubbedSelector.withArgs('.edit').returns(edit);
        stubbedSelector.withArgs('.display').returns(display);
        return view.showDisplay();
      });
      it('hides edit', function() {
        return expect(stubbedEdit).to.have.been.calledOnce;
      });
      it('shows display', function() {
        return expect(stubbedDisplay).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedSelector.restore();
      });
    });
    describe('#showEdit', function() {
      var stubbedDisplay, stubbedEdit, stubbedFind, stubbedFocus, stubbedModelGet, stubbedSelect, stubbedSelector, stubbedVal, title;
      title = 'test doc';
      stubbedSelector = null;
      stubbedDisplay = null;
      stubbedEdit = null;
      stubbedFind = null;
      stubbedVal = null;
      stubbedSelect = null;
      stubbedFocus = null;
      stubbedModelGet = null;
      before(function() {
        var display, edit;
        display = {
          hide: function() {}
        };
        edit = {
          show: function() {},
          find: function(selector) {},
          val: function(value) {},
          select: function() {},
          focus: function() {}
        };
        stubbedFind = sinon.stub(edit, 'find', function() {
          return edit;
        });
        stubbedVal = sinon.stub(edit, 'val', function() {
          return edit;
        });
        stubbedSelect = sinon.stub(edit, 'select', function() {
          return edit;
        });
        stubbedFocus = sinon.stub(edit, 'focus', function() {
          return edit;
        });
        stubbedDisplay = sinon.stub(display, 'hide', function() {});
        stubbedEdit = sinon.stub(edit, 'show', function() {
          return edit;
        });
        stubbedSelector = sinon.stub(view, '$');
        stubbedSelector.withArgs('.display').returns(display);
        stubbedSelector.withArgs('.edit').returns(edit);
        stubbedModelGet = sinon.stub(view.model, 'get');
        stubbedModelGet.withArgs('title').returns(title);
        return view.showEdit();
      });
      it('hides display', function() {
        return expect(stubbedDisplay).to.have.been.calledOnce;
      });
      it('shows edit', function() {
        return expect(stubbedEdit).to.have.been.calledOnce;
      });
      it('sets title as input value', function() {
        return expect(stubbedVal).to.have.been.calledWith(title);
      });
      it('selects the input', function() {
        return expect(stubbedSelect).to.have.been.calledOnce;
      });
      it('sets focus to input', function() {
        return expect(stubbedFocus).to.have.been.calledOnce;
      });
      return after(function() {
        stubbedModelGet.restore();
        return stubbedSelector.restore();
      });
    });
    describe('#onEdit', function() {
      var stubbedShowEdit;
      stubbedShowEdit = null;
      before(function() {
        stubbedShowEdit = sinon.stub(view, 'showEdit', function() {});
        return view.onEdit({
          preventDefault: function() {},
          stopPropagation: function() {}
        });
      });
      it('executes #showEdit', function() {
        return expect(stubbedShowEdit).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedShowEdit.restore();
      });
    });
    describe('#onCancel', function() {
      var stubbedShowDisplay;
      stubbedShowDisplay = null;
      before(function() {
        stubbedShowDisplay = sinon.stub(view, 'showDisplay', function() {});
        return view.onCancel({
          preventDefault: function() {},
          stopPropagation: function() {}
        });
      });
      it('executes #showDisplay', function() {
        return expect(stubbedShowDisplay).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedShowDisplay.restore();
      });
    });
    describe('#onUpdateOrCancel', function() {
      var stubbedShowDisplay;
      stubbedShowDisplay = null;
      before(function() {
        return stubbedShowDisplay = sinon.stub(view, 'showDisplay', function() {});
      });
      describe('enter key', function() {
        var stubbedModelSave, title;
        title = 'test doc';
        stubbedModelSave = null;
        before(function() {
          var input, stubbedModelGet;
          stubbedModelGet = sinon.stub(view.model, 'get', function() {});
          stubbedModelSave = sinon.stub(view.model, 'save', function() {});
          input = $('<input/>', {
            value: title
          });
          return view.onUpdateOrCancel({
            stopPropagation: function() {},
            preventDefault: function() {},
            which: 13,
            currentTarget: input
          });
        });
        it('saves the model', function() {
          return expect(stubbedModelSave).to.have.been.calledWith({
            title: title
          });
        });
        it('shows display', function() {
          return expect(stubbedShowDisplay).to.have.been.calledOnce;
        });
        return after(function() {
          return stubbedShowDisplay.reset();
        });
      });
      describe('escape key', function() {
        before(function() {
          return view.onUpdateOrCancel({
            stopPropagation: function() {},
            preventDefault: function() {},
            which: 27
          });
        });
        it('shows display', function() {
          return expect(stubbedShowDisplay).to.have.been.calledOnce;
        });
        return after(function() {
          return stubbedShowDisplay.reset();
        });
      });
      return after(function() {
        return stubbedShowDisplay.restore();
      });
    });
    describe('#onDestroy', function() {
      var stubbedConfirm, stubbedModelDestroy;
      stubbedConfirm = null;
      stubbedModelDestroy = null;
      before(function() {
        stubbedConfirm = sinon.stub($, 'confirm').yieldsTo('ok');
        stubbedModelDestroy = sinon.stub(view.model, 'destroy', function() {});
        return view.onDestroy({
          preventDefault: function() {},
          stopPropagation: function() {}
        });
      });
      it('asks for confirmation', function() {
        return expect(stubbedConfirm).to.have.been.calledOnce;
      });
      it('destroys the model', function() {
        return expect(stubbedModelDestroy).to.have.been.calledOnce;
      });
      return after(function() {
        return stubbedConfirm.restore();
      });
    });
    return after(function() {
      return stubbedListenTo.restore();
    });
  });
});
