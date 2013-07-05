
define(function(require) {
  var Composite, Context;
  Composite = require('../../../../../application/uml/models/sequence/composite');
  Context = require('../../../../../application/uml/language/sequence/context');
  return describe('uml/language/sequence/context', function() {
    var context;
    context = null;
    beforeEach(function() {
      return context = new Context;
    });
    describe('new', function() {
      beforeEach(function() {
        return context = new Context('A -> B: Test');
      });
      it('has same payload', function() {
        return expect(context.payload).to.equal('A -> B: Test');
      });
      it('does not have title', function() {
        return expect(context.title).to.be.undefined;
      });
      it('has empty participants', function() {
        return expect(context.participants).to.be.empty;
      });
      it('has empty commands', function() {
        return expect(context.commands).to.be.empty;
      });
      it('does not have any line', function() {
        return expect(context.line).to.be.undefined;
      });
      it('does not have any index', function() {
        return expect(context.index).to.be.undefined;
      });
      return it('does not have parent command', function() {
        return expect(context.parentCommand).to.be.undefined;
      });
    });
    describe('#getLineNumber', function() {
      var lineNumber;
      lineNumber = null;
      beforeEach(function() {
        return lineNumber = context.getLineNumber();
      });
      return it('returns +1 of index', function() {
        return expect(lineNumber).to.equal(1);
      });
    });
    describe('#updateLineInfo', function() {
      beforeEach(function() {
        return context.updateLineInfo('A -> B: Test', 1);
      });
      it('sets line', function() {
        return expect(context.line).to.equal('A -> B: Test');
      });
      return it('sets index', function() {
        return expect(context.index).to.equal(1);
      });
    });
    describe('#setTitle', function() {
      var title;
      title = null;
      beforeEach(function() {
        return title = context.setTitle('Test Sequence');
      });
      it('returns new title', function() {
        return expect(title).to.be.ok;
      });
      return it('sets title text', function() {
        return expect(title.text).to.equal('Test Sequence');
      });
    });
    describe('#addParticipant', function() {
      var participant;
      participant = null;
      beforeEach(function() {
        return participant = context.addParticipant('A very long name', 'A');
      });
      it('returns new participant', function() {
        return expect(participant).to.be.ok;
      });
      it('sets participant name', function() {
        return expect(participant.name).to.equal('A very long name');
      });
      it('sets participant alias', function() {
        return expect(participant.alias).to.equal('A');
      });
      return it('adds to participants to collection', function() {
        return expect(context.participants).to.contain(participant);
      });
    });
    describe('#addMessage', function() {
      var message, receiver, sender;
      sender = null;
      receiver = null;
      message = null;
      beforeEach(function() {
        sender = {};
        receiver = {};
        return message = context.addMessage(sender, receiver, 'test', true, true);
      });
      it('returns new message', function() {
        return expect(message).to.be.ok;
      });
      it('sets sender', function() {
        return expect(message.sender).to.deep.equal(sender);
      });
      it('sets receiver', function() {
        return expect(message.receiver).to.deep.equal(receiver);
      });
      it('sets name', function() {
        return expect(message.name).to.equal('test');
      });
      it('sets async', function() {
        return expect(message.async).to.be["true"];
      });
      it('sets call return', function() {
        return expect(message.callReturn).to.be["true"];
      });
      describe('without parent', function() {
        return it('adds to commands to collection', function() {
          return expect(context.commands).to.contain(message);
        });
      });
      return describe('with parent', function() {
        var parent;
        parent = null;
        beforeEach(function() {
          parent = new Composite;
          context.parentCommand = parent;
          return message = context.addMessage(sender, receiver, 'test', true, true);
        });
        it('does not add to commands collection', function() {
          return expect(context.commands).to.not.contain(message);
        });
        return it('adds to parent command child collection', function() {
          return expect(parent.children).to.contain(message);
        });
      });
    });
    describe('#addGroup', function() {
      var group;
      group = null;
      beforeEach(function() {
        return group = context.addGroup('opt', 'condition');
      });
      it('returns new group', function() {
        return expect(group).to.be.ok;
      });
      it('sets type', function() {
        return expect(group.type).to.equal('opt');
      });
      it('sets label', function() {
        return expect(group.label).to.equal('condition');
      });
      it('sets group as parent command', function() {
        return expect(context.parentCommand).to.deep.equal(group);
      });
      describe('without parent', function() {
        return it('adds to commands collection', function() {
          return expect(context.commands).to.contain(group);
        });
      });
      return describe('with parent', function() {
        var parent;
        parent = null;
        beforeEach(function() {
          parent = new Composite;
          context.parentCommand = parent;
          return group = context.addGroup('opt', 'condition');
        });
        it('does not add to commands collection', function() {
          return expect(context.commands).to.not.contain(group);
        });
        return it('adds to parent command child collection', function() {
          return expect(parent.children).to.contain(group);
        });
      });
    });
    describe('#addIf', function() {
      var ifGroup;
      ifGroup = null;
      beforeEach(function() {
        return ifGroup = context.addIf('condition 1');
      });
      it('returns new group', function() {
        return expect(ifGroup).to.be.ok;
      });
      it('does not set type', function() {
        return expect(ifGroup.type).to.be.undefined;
      });
      it('sets label', function() {
        return expect(ifGroup.label).to.equal('condition 1');
      });
      it('sets group as parent command', function() {
        return expect(context.parentCommand).to.deep.equal(ifGroup);
      });
      describe('without parent', function() {
        return it('adds condition to commands collection', function() {
          return expect(context.commands).to.contain(ifGroup.parent);
        });
      });
      return describe('with parent', function() {
        var parent;
        parent = null;
        beforeEach(function() {
          parent = new Composite;
          context.parentCommand = parent;
          return ifGroup = context.addIf('condition 1');
        });
        it('does not add condition to commands collection', function() {
          return expect(context.commands).to.not.contain(ifGroup.parent);
        });
        return it('adds condition to parent command child collection', function() {
          return expect(parent.children).to.contain(ifGroup.parent);
        });
      });
    });
    describe('#addElse', function() {
      var elseGroup;
      elseGroup = null;
      describe('if group is set', function() {
        beforeEach(function() {
          context.addIf('condition 1');
          return elseGroup = context.addElse('condition 2');
        });
        it('returns new group', function() {
          return expect(elseGroup).to.be.ok;
        });
        it('does not set type', function() {
          return expect(elseGroup.type).to.be.undefined;
        });
        it('sets label', function() {
          return expect(elseGroup.label).to.equal('condition 2');
        });
        return it('sets group as parent command', function() {
          return expect(context.parentCommand).to.deep.equal(elseGroup);
        });
      });
      return describe('if group is not set', function() {
        return it('throws', function() {
          return expect(function() {
            return context.addElse('condition 2');
          }).to["throw"]('Error on line 1, cannot use \"else\" without an \"alt\".');
        });
      });
    });
    describe('#closeParent', function() {
      describe('parent command is set', function() {
        beforeEach(function() {
          context.parentCommand = new Composite;
          return context.closeParent();
        });
        return it('parent command is no longer set', function() {
          return expect(context.parentCommand).to.be.undefined;
        });
      });
      return describe('parent command is not set', function() {
        return it('throws', function() {
          return expect(function() {
            return context.closeParent();
          }).to["throw"]('Error on line 1, cannot end without a group start.');
        });
      });
    });
    describe('#done', function() {
      return describe('parent command is set', function() {
        beforeEach(function() {
          return context.parentCommand = new Composite;
        });
        return it('throws', function() {
          return expect(function() {
            return context.done();
          }).to["throw"]('Error! One or more group(s) is not properly closed, please ' + 'add the missing \"end\" for unclosed group(s).');
        });
      });
    });
    return describe('getDiagram', function() {
      var diagram;
      diagram = null;
      beforeEach(function() {
        return diagram = context.getDiagram();
      });
      it('returns new diagram', function() {
        return expect(diagram).to.be.ok;
      });
      it('has same title', function() {
        return expect(diagram.title).to.equal(context.title);
      });
      it('has same participants', function() {
        return expect(diagram.participants).to.equal(context.participants);
      });
      return it('has same commands', function() {
        return expect(diagram.commands).to.equal(context.commands);
      });
    });
  });
});
