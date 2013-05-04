define (require) ->
  ForgotPassword    = require '../../../application/views/forgotpassword'
  Model             = require '../../../application/models/forgotpassword'

  describe 'views/forgotpassword', ->

    it 'has ForgotPassword as #modelType', ->
      expect(ForgotPassword::modelType).to.be.deep.equal Model

    it 'has passwordResetTokenRequested as #successEvent', ->
      expect(ForgotPassword::successEvent).to.equal 'passwordResetTokenRequested'

    it 'can handle ajax error', ->
      expect(ForgotPassword).to.respondTo 'handleError'