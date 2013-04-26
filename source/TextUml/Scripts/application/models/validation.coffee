define ->
  isValidEmailFormat: (value) ->
    value and /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test value

  isValidPasswordLength: (value) ->
    value and 64 >= value.length >= 6

  addError: (errors, attribute, message) ->
    (errors[attribute] or= []).push message