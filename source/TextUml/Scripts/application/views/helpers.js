define(function(require) {
  var $, moment, _;

  $ = require('jquery');
  _ = require('underscore');
  moment = require('moment');
  require('form');
  return {
    formatAsRelativeTime: function(date) {
      return moment(date).fromNow();
    },
    formatAsHumanizeTime: function(date) {
      return moment(date).format('dddd, MMMM Do YYYY, h:mm a');
    },
    hasModelErrors: function(jqxhr) {
      return jqxhr.status === 400;
    },
    getModelErrors: function(jqxhr) {
      var e, modelStateProperty, response;

      try {
        response = $.parseJSON(jqxhr.responseText);
      } catch (_error) {
        e = _error;
        response = null;
      }
      if (response) {
        modelStateProperty = _(response).chain().keys().filter(function(key) {
          return key.toLowerCase() === 'modelstate';
        }).first().value();
        if (modelStateProperty) {
          return response[modelStateProperty];
        }
      }
      return void 0;
    },
    subscribeModelInvalidEvent: function(model, element) {
      return model.once('invalid', function() {
        return element.showFieldErrors({
          errors: model.validationError
        });
      });
    }
  };
});
