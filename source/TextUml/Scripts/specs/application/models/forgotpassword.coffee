define (require) ->
  ForgotPassword  = require '../../../application/models/forgotpassword'

  describe 'models/forgotpassword', ->
    forgotPassword = null

    beforeEach -> forgotPassword = new ForgotPassword

    describe '#defaults', ->

      it 'has #email', -> expect(forgotPassword.defaults()).to.have.property 'email'

    describe '#url', ->
      it 'is set', -> expect(forgotPassword.url).to.exist

    describe 'validation', ->

      describe 'valid', ->
        beforeEach -> forgotPassword.set email: 'user@example.com'

        it 'is valid', -> expect(forgotPassword.isValid()).to.be.ok
       
      describe 'invalid', ->
        
        describe 'missing', ->
          it 'is invalid', ->
            expect(forgotPassword.isValid()).to.not.be.ok
            expect(forgotPassword.validationError)
              .to.have.property 'email'

        describe 'blank', ->
          beforeEach -> forgotPassword.set email: ''

          it 'is invalid', ->
            expect(forgotPassword.isValid()).to.not.be.ok
            expect(forgotPassword.validationError)
              .to.have.property 'email'

        describe 'incorrect format', ->
          beforeEach -> forgotPassword.set email: 'foo bar'

          it 'is invalid', ->
            expect(forgotPassword.isValid()).to.not.be.ok
            expect(forgotPassword.validationError)
              .to.have.property 'email'