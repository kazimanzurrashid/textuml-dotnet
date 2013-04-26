define ->
  repeatString: (length = 1, character = 'x') ->
    (new Array(length + 1)).join character