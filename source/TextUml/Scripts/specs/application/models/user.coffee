define (require) ->
  _               = require 'underscore'
  User            = require '../../../application/models/user'
  repeatString    = require('../../helpers').repeatString

  describe 'models/user', ->
    user = null

    beforeEach -> user = new User

    describe '#defaults', ->

      it 'has #email', ->
        expect(user.defaults()).to.have.property 'email'

      it 'has #password', ->
        expect(user.defaults()).to.have.property 'password'

      it 'has #confirmPassword', ->
        expect(user.defaults()).to.have.property 'confirmPassword'

    describe '#url', ->
      it 'is set', -> expect(user.url).to.exist

    describe 'validation', ->

      describe 'valid', ->
        beforeEach ->
          user.set
            email             : 'user@example.com'
            password          : '$ecre8'
            confirmPassword   : '$ecre8'

        it 'is valid', -> expect(user.isValid()).to.be.ok
       
      describe 'invalid', ->
        
        describe '#email', ->
          
          describe 'missing', ->
            beforeEach ->
              user.set
                password          : '$secret'
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'email'
 
          describe 'blank', ->
            beforeEach ->
              user.set
                email             : ''
                password          : '$secret'
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'email'

          describe 'incorrect format', ->
            beforeEach ->
              user.set
                email             : 'foo bar'
                password          : '$secret'
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'email'

        describe '#password', ->
          
          describe 'missing', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'password'
 
          describe 'blank', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : ''
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'password'

          describe 'less than minimum length', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : repeatString 5
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'password'

          describe 'more than maximum length', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : repeatString 65
                confirmPassword   : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'password'

        describe '#confirmPassword', ->
          
          describe 'missing', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : '$ecre8'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'confirmPassword'
 
          describe 'blank', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : '$ecre8'
                confirmPassword   : ''

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'confirmPassword'

          describe 'do not match', ->
            beforeEach ->
              user.set
                email             : 'user@example.com'
                password          : '$ecre8'
                confirmPassword   : 'foo bar'

            it 'is invalid', ->
              expect(user.isValid()).to.not.be.ok
              expect(user.validationError).to.have.property 'confirmPassword'