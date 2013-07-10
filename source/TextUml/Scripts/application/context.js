
define(function(require) {
  var Context, Documents;
  Documents = require('./models/documents');
  return Context = (function() {

    Context.prototype.documentsType = Documents;

    function Context(options) {
      this.resetCurrentDocument();
      this.documents = new this.documentsType;
      if (options.userSignedIn) {
        if (options.documents) {
          this.documents.reset(options.documents.data);
          this.documents.setCounts(options.documents.count);
        }
        this.userSignedIn(false);
      }
    }

    Context.prototype.isUserSignedIn = function() {
      return this.signedIn;
    };

    Context.prototype.userSignedIn = function(fetchDocuments) {
      if (fetchDocuments == null) {
        fetchDocuments = true;
      }
      this.signedIn = true;
      if (fetchDocuments) {
        return this.documents.fetch({
          reset: true
        });
      }
    };

    Context.prototype.userSignedOut = function() {
      this.signedIn = false;
      this.documents.reset();
      return this.resetCurrentDocument();
    };

    Context.prototype.resetCurrentDocument = function() {
      this.id = null;
      this.title = null;
      this.content = null;
      this.owned = true;
      this.shared = false;
      return this.editable = true;
    };

    Context.prototype.setCurrentDocument = function(id, callback) {
      var _this = this;
      return this.documents.fetchOne(id, {
        success: function(document) {
          var attributes;
          attributes = document.toJSON();
          _this.id = attributes.id;
          _this.title = attributes.title;
          _this.content = attributes.content;
          _this.owned = attributes.owned;
          _this.shared = attributes.shared;
          _this.editable = attributes.editable;
          return typeof callback === "function" ? callback(document) : void 0;
        },
        error: function() {
          _this.resetCurrentDocument();
          return typeof callback === "function" ? callback() : void 0;
        }
      });
    };

    Context.prototype.getCurrentDocumentId = function() {
      return this.id;
    };

    Context.prototype.getCurrentDocumentTitle = function() {
      return this.title || '';
    };

    Context.prototype.setCurrentDocumentTitle = function(value) {
      if (!this.isCurrentDocumentEditable()) {
        return false;
      }
      if (!value) {
        value = null;
      }
      return this.title = value;
    };

    Context.prototype.getCurrentDocumentContent = function() {
      return this.content || '';
    };

    Context.prototype.setCurrentDocumentContent = function(value) {
      if (!this.isCurrentDocumentEditable()) {
        return false;
      }
      if (!value) {
        value = null;
      }
      return this.content = value;
    };

    Context.prototype.isCurrentDocumentNew = function() {
      return !this.id;
    };

    Context.prototype.isCurrentDocumentEditable = function() {
      return this.editable;
    };

    Context.prototype.isCurrentDocumentOwned = function() {
      return this.owned;
    };

    Context.prototype.isCurrentDocumentShared = function() {
      return this.shared;
    };

    Context.prototype.canShareCurrentDocumentUpdate = function() {
      return this.isCurrentDocumentShared() && this.isCurrentDocumentEditable();
    };

    Context.prototype.saveCurrentDocument = function(callback) {
      var attributes, document,
        _this = this;
      if (!this.isCurrentDocumentEditable()) {
        return false;
      }
      attributes = {
        content: this.content
      };
      if (this.isCurrentDocumentNew()) {
        attributes.title = this.title;
        return this.documents.create(attributes, {
          wait: true,
          success: function(doc) {
            _this.id = doc.id;
            return typeof callback === "function" ? callback() : void 0;
          }
        });
      } else {
        document = this.documents.get(this.id);
        return document.save(attributes, {
          success: function() {
            return typeof callback === "function" ? callback() : void 0;
          }
        });
      }
    };

    Context.prototype.getNewDocumentTitle = function() {
      var count, title;
      title = this.title;
      if (!title) {
        count = this.documents.length + 1;
        title = "New document " + count;
      }
      return title;
    };

    return Context;

  })();
});
