define (require) ->
  Validation    = require '../../../application/models/validation'
  repeatString  = require('../../helpers').repeatString

  describe 'models/validation', ->

    describe '.isValidEmailFormat', ->

      describe 'valid', ->
        it 'returns true', ->
          expect(Validation.isValidEmailFormat 'user@example.com').to.be.ok

      describe 'invalid', ->
        it 'returns false', ->
          expect(Validation.isValidEmailFormat 'foo-bar').not.to.be.ok

    describe '.isValidPasswordLength', ->

      describe 'valid', ->
        it 'returns true', ->
          expect(Validation.isValidPasswordLength '$ecre8').to.be.ok

      describe 'invalid', ->

        describe 'less than six character', ->
          it 'returns false', ->
            expect(Validation.isValidPasswordLength(repeatString 5))
              .not.to.be.ok

        describe 'more than sixty four character', ->
          it 'returns false', ->
            expect(Validation.isValidPasswordLength(repeatString 65))
              .not.to.be.ok

    describe '.addError', ->
      errors = null

      beforeEach ->
        errors = {}
        Validation.addError errors, 'name', 'Name is required.'

      it 'creates new attribute', -> expect(errors).to.include.key 'name'

      it 'appends message', ->
        expect(errors.name).to.include 'Name is required.'