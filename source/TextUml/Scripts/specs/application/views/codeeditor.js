
define(function(require) {
  var $, CodeEditor, CodeMirror, events;
  $ = require('jquery');
  CodeMirror = require('codemirror');
  CodeEditor = require('../../../application/views/codeeditor');
  events = require('../../../application/events');
  return describe('views/codeeditor', function() {
    var context, spiedListenTo, view;
    context = null;
    spiedListenTo = null;
    view = null;
    before(function() {
      fixtures.set('<textarea id="code-text-area"></textarea>');
      context = {
        getCurrentDocumentContent: function() {},
        setCurrentDocumentContent: function(code) {},
        isCurrentDocumentEditable: function() {}
      };
      spiedListenTo = sinon.spy(CodeEditor.prototype, 'listenTo');
      return view = new CodeEditor({
        el: $(fixtures.window().document.body).find('#code-text-area'),
        context: context
      });
    });
    describe('new', function() {
      it('creates code mirror editor', function() {
        return expect(view.editor).to.exist;
      });
      it('subscribes to exampleSelected application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'exampleSelected', view.onExampleSelected);
      });
      return it('subscribes to documentChanged application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'documentChanged', view.onDocumentChanged);
      });
    });
    describe('#onExampleSelected', function() {
      var snippet;
      snippet = 'A -> B: Method';
      before(function() {
        var example, stubbedGet;
        example = {
          get: function(attr) {}
        };
        stubbedGet = sinon.stub(example, 'get');
        stubbedGet.withArgs('snippet').returns(snippet);
        sinon.stub(context, 'isCurrentDocumentEditable', function() {
          return true;
        });
        return view.onExampleSelected({
          example: example
        });
      });
      return it('appends example snippet', function() {
        return expect(view.editor.getValue()).to.contain(snippet);
      });
    });
    describe('#onDocumentChanged', function() {
      var content;
      content = 'A -> B: Method\nA <- B: Method returns';
      before(function() {
        sinon.stub(context, 'getCurrentDocumentContent', function() {
          return content;
        });
        return view.onDocumentChanged();
      });
      return it('replaces with current document content', function() {
        return expect(view.editor.getValue()).to.equal(content);
      });
    });
    describe('#onCodeChanged', function() {
      var content, originalOldCode, stubbedEventsTrigger, stubbedSetContent;
      content = 'A -> B: Method\nA <- B: Method returns';
      originalOldCode = null;
      stubbedSetContent = null;
      stubbedEventsTrigger = null;
      before(function() {
        view.oldCode = view.oldCode;
        stubbedSetContent = sinon.stub(context, 'setCurrentDocumentContent', function() {});
        stubbedEventsTrigger = sinon.stub(events, 'trigger', function() {});
        view.editor.setValue(content);
        view.oldCode = '';
        return view.onCodeChanged();
      });
      it('sets current document content', function() {
        return expect(stubbedSetContent).to.have.been.calledWith(content);
      });
      it('triggers codeChanged application event', function() {
        return expect(stubbedEventsTrigger).to.have.been.calledWith('codeChanged', {
          code: content
        });
      });
      return after(function() {
        view.oldCode = originalOldCode;
        stubbedSetContent.restore();
        return stubbedEventsTrigger.restore();
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
