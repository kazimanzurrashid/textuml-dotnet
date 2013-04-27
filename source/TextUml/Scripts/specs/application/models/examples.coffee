define (require) ->
  Example   = require '../../../application/models/example'
  Examples  = require '../../../application/models/examples'

  describe 'models/examples', ->
    examples = null

    beforeEach -> examples = new Examples

    describe '#model', ->
      it 'is Example', ->
        expect(examples.model).to.eql Example
