define(function(require) {
  var Group, GroupNames, GroupType, Regex, trim, _;

  _ = require('underscore');
  GroupType = require('../../models/sequence/grouptype');
  trim = require('./helpers').trim;
  GroupNames = _(GroupType).values();
  Regex = new RegExp("^[\\s|\\t]*(" + (GroupNames.join('|')) + ")\\s*(.*)", 'i');
  return Group = (function() {
    function Group() {}

    Group.prototype.handles = function(context) {
      var match;

      if (match = context.line.match(Regex)) {
        context.addGroup(trim(match[1]), trim(match[2]));
        return true;
      }
      return false;
    };

    return Group;

  })();
});
