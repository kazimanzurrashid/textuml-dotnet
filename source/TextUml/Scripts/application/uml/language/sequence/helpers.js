define(function() {
  return {
    trim: function(input) {
      var counter, result;

      if (!input) {
        return input;
      }
      result = input.replace(/^\s+/, '');
      counter = result.length - 1;
      while (counter >= 0) {
        if (/\S/.test(result.charAt(counter))) {
          result = result.substring(0, counter + 1);
          break;
        }
        counter--;
      }
      return result;
    }
  };
});
