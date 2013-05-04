define(function() {
  return {
    isValidEmailFormat: function(value) {
      return value && /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
    },
    isValidPasswordLength: function(value) {
      var _ref;

      return value && (64 >= (_ref = value.length) && _ref >= 6);
    },
    addError: function(errors, attribute, message) {
      return (errors[attribute] || (errors[attribute] = [])).push(message);
    }
  };
});
