define (require) ->
  SignIn    = require '../../../application/views/signin'
  Model     = require '../../../application/models/session'

  describe 'views/signin', ->

    it 'has Session as #modelType', ->
      expect(SignIn::modelType).to.be.deep.equal Model

    it 'has signedIn as #successEvent', ->
      expect(SignIn::successEvent).to.equal 'signedIn'

    it 'can handle ajax error', ->
      expect(SignIn).to.respondTo 'handleError'