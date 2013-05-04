define(function() {
  var Diagram;

  return Diagram = (function() {
    function Diagram(title, participants, commands) {
      this.title = title;
      this.participants = participants != null ? participants : [];
      this.commands = commands != null ? commands : [];
    }

    return Diagram;

  })();
});
