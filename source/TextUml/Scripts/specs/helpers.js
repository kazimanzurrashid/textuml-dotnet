
define(function() {
  return {
    repeatString: function(length, character) {
      if (length == null) {
        length = 1;
      }
      if (character == null) {
        character = 'x';
      }
      return (new Array(length + 1)).join(character);
    }
  };
});
