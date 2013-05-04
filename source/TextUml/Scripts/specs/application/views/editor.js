define(function(require) {
  var $, Editor, events;

  $ = require('jquery');
  Editor = require('../../../application/views/editor');
  events = require('../../../application/events');
  return describe('views/editor', function() {
    var originalCodeEditorViewType, originalOutputGeneratorViewType, originalParerType, spiedListenTo, view;

    originalCodeEditorViewType = null;
    originalOutputGeneratorViewType = null;
    originalParerType = null;
    spiedListenTo = null;
    view = null;
    before(function() {
      originalCodeEditorViewType = Editor.prototype.codeEditorViewType;
      originalOutputGeneratorViewType = Editor.prototype.outputGeneratorViewType;
      originalParerType = Editor.prototype.parserType;
      Editor.prototype.codeEditorViewType = sinon.stub().returns({});
      Editor.prototype.outputGeneratorViewType = sinon.stub().returns({});
      Editor.prototype.parserType = sinon.stub().returns({
        parse: function() {}
      });
      spiedListenTo = sinon.spy(Editor.prototype, 'listenTo');
      fixtures.set('<div id="editor-container"></div>');
      return view = new Editor({
        el: $(fixtures.window().document.body).find('#editor-container')
      });
    });
    describe('new', function() {
      it('creates code editor view', function() {
        return expect(view.code).to.exist;
      });
      it('creates output generator view', function() {
        return expect(view.output).to.exist;
      });
      it('creates parser', function() {
        return expect(view.parser).to.exist;
      });
      return it('subscribes to codeChanged application event', function() {
        return expect(spiedListenTo).to.have.been.calledWith(events, 'codeChanged', view.onCodeChanged);
      });
    });
    describe('#onCodeChanged', function() {
      var code, stubbedParse;

      code = 'A -> B: Method';
      stubbedParse = null;
      before(function() {
        stubbedParse = sinon.stub(view.parser, 'parse', function() {});
        return view.onCodeChanged({
          code: code
        });
      });
      it('parses the code', function() {
        return expect(stubbedParse).to.have.been.calledWith(code);
      });
      return after(function() {
        return stubbedParse.restore();
      });
    });
    return after(function() {
      view.undelegateEvents();
      view.stopListening();
      spiedListenTo.restore();
      Editor.prototype.codeEditorViewType = originalCodeEditorViewType;
      Editor.prototype.outputGeneratorViewType = originalOutputGeneratorViewType;
      Editor.prototype.parserType = originalParerType;
      return fixtures.cleanUp();
    });
  });
});
