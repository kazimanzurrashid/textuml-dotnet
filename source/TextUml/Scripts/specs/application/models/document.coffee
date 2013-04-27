define (require) ->
  _         = require 'underscore'
  Document  = require '../../../application/models/document'

  describe 'models/document', ->
    document = null

    beforeEach -> document = new Document

    describe '#defaults', ->

      it 'has #title', ->
        expect(document.defaults()).to.have.property 'title'

      it 'has #content', ->
        expect(document.defaults()).to.have.property 'content'

      it 'has #createdAt', ->
        expect(document.defaults()).to.have.property 'createdAt'
          
      it 'has #updatedAt', ->
        expect(document.defaults()).to.have.property 'updatedAt'

    describe '#urlRoot', ->
      it 'is set', -> expect(document.urlRoot).to.exist

    describe 'validation', ->

      describe 'valid', ->
        beforeEach ->
          document.set
            title       : 'Test Diagram'
            content     : 'A -> B: Method1'
            createdAt   : new Date
            updatedAt   : new Date

        it 'is valid', -> expect(document.isValid()).to.be.ok
       
      describe 'invalid', ->
        
        describe '#title', ->
          
          describe 'missing', ->
            it 'is invalid', ->
              expect(document.isValid()).to.not.be.ok
              expect(document.validationError).to.have.property 'title'
 
          describe 'blank', ->
            beforeEach ->
              document.set title : ''

            it 'is invalid', ->
              expect(document.isValid()).to.not.be.ok
              expect(document.validationError).to.have.property 'title'