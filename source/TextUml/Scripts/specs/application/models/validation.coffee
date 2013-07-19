define (require) ->
  validation    = require '../../../application/models/validation'
  repeatString  = require('../../helpers').repeatString

  describe 'models/validation', ->

    describe '.isValidEmailFormat', ->

      describe 'valid', ->
        it 'returns true', ->
          expect(validation.isValidEmailFormat 'user@example.com').to.be.ok

      describe 'invalid', ->
        it 'returns false', ->
          expect(validation.isValidEmailFormat 'foo-bar').not.to.be.ok

    describe '.isValidPasswordLength', ->

      describe 'valid', ->
        it 'returns true', ->
          expect(validation.isValidPasswordLength '$ecre8').to.be.ok

      describe 'invalid', ->

        describe 'less than six characters', ->
          it 'returns false', ->
            expect(validation.isValidPasswordLength(repeatString 5))
              .not.to.be.ok

        describe 'more than sixty four characters', ->
          it 'returns false', ->
            expect(validation.isValidPasswordLength(repeatString 65))
              .not.to.be.ok

    describe '.addError', ->
      errors = null

      beforeEach ->
        errors = {}
        validation.addError errors, 'name', 'Name is required.'

      it 'creates new attribute', -> expect(errors).to.include.key 'name'

      it 'appends message', ->
        expect(errors.name).to.include 'Name is required.'