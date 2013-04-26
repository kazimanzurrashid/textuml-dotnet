define ->
  trim: (input) ->
    return input unless input
    result = input.replace /^\s+/, ''
    counter = result.length - 1
    while counter >= 0
      if /\S/.test result.charAt(counter)
        result = result.substring 0, counter + 1
        break
      counter--
    result