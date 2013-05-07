
define(function(require) {
  var Condition;
  Condition = require('../../../../../application/uml/models/sequence/condition');
  return describe('uml/models/sequence/condition', function() {
    var condition;
    condition = null;
    beforeEach(function() {
      return condition = new Condition;
    });
    describe('#createIfGroup', function() {
      var ifGroup;
      ifGroup = null;
      beforeEach(function() {
        return ifGroup = condition.createIfGroup('true');
      });
      it('returns new group', function() {
        return expect(ifGroup).to.be.ok;
      });
      it('group has label', function() {
        return expect(ifGroup.label).to.equal('true');
      });
      return it('group has condition as parent', function() {
        return expect(ifGroup.parent).to.deep.equal(condition);
      });
    });
    describe('#addElseGroup', function() {
      var elseGroup;
      elseGroup = null;
      beforeEach(function() {
        return elseGroup = condition.addElseGroup('false');
      });
      it('returns new group', function() {
        return expect(elseGroup).to.be.ok;
      });
      it('group has label', function() {
        return expect(elseGroup.label).to.equal('false');
      });
      return it('group has condition as parent', function() {
        return expect(elseGroup.parent).to.deep.equal(condition);
      });
    });
    describe('#getIfGroup', function() {
      var ifGroup;
      ifGroup = null;
      beforeEach(function() {
        condition.createIfGroup('morning');
        condition.addElseGroup('noon');
        condition.addElseGroup('evening');
        return ifGroup = condition.getIfGroup();
      });
      return it('returns first item of child collection', function() {
        return expect(ifGroup).to.deep.equal(condition.children[0]);
      });
    });
    return describe('#getElseGroups', function() {
      var elseGroups;
      elseGroups = null;
      beforeEach(function() {
        condition.createIfGroup('morning');
        condition.addElseGroup('noon');
        condition.addElseGroup('evening');
        return elseGroups = condition.getElseGroups();
      });
      return it('returns from second item of child collection', function() {
        expect(elseGroups[0]).to.deep.equal(condition.children[1]);
        return expect(elseGroups[1]).to.deep.equal(condition.children[2]);
      });
    });
  });
});
