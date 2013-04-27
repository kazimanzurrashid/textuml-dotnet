define (require) ->
  Example  = require '../../../application/models/example'

  describe 'models/example', ->
    example = null

    beforeEach -> example = new Example

    describe '#defaults', ->

      it 'has #display', ->
        expect(example.defaults()).to.have.property 'display'

      it 'has #snippet', ->
        expect(example.defaults()).to.have.property 'snippet'