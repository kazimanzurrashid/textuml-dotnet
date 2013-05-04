define (require) ->
  SignUp    = require '../../../application/views/signup'
  Model     = require '../../../application/models/user'

  describe 'views/signup', ->

    it 'has User as #modelType', ->
      expect(SignUp::modelType).to.be.deep.equal Model

    it 'has signedUp as #successEvent', ->
      expect(SignUp::successEvent).to.equal 'signedUp'

    it 'can handle ajax error', ->
      expect(SignUp).to.respondTo 'handleError'