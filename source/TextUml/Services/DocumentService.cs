namespace TextUml.Services
{
    using System;
    using System.Linq;
    using System.Linq.Dynamic;

    using DataAccess;
    using DomainObjects;
    using Extensions;
    using Infrastructure;
    using Models;

    public interface IDocumentService
    {
        PagedQueryResult<DocumentRead> Query(DocumentsQuery model);

        DocumentRead One(int id, Action notFound);

        DocumentRead Create(DocumentEdit model);

        DocumentRead Update(int id, DocumentEdit model, Action notFound);

        void Delete(int id, Action notFound);
    }

    public class DocumentService : IDocumentService
    { 
        private readonly IDataContext dataContext;
        private readonly ICurrentUserProvider currentUserProvider;

        public DocumentService(
            IDataContext dataContext,
            ICurrentUserProvider currentUserProvider)
        {
            this.dataContext = dataContext;
            this.currentUserProvider = currentUserProvider;
        }

        public PagedQueryResult<DocumentRead> Query(DocumentsQuery model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            var userId = currentUserProvider.UserId;
            var documents = Query();

            if (!string.IsNullOrWhiteSpace(model.Filter))
            {
                // ReSharper disable ImplicitlyCapturedClosure
                documents = documents.Where(d =>
                    d.Title.Contains(model.Filter));
                // ReSharper restore ImplicitlyCapturedClosure
            }

            documents = documents.OrderBy(model.OrderByClause);

            if (model.Skip > 0)
            {
                documents = documents.Skip(model.Skip);
            }

            var data = documents.Take(model.Top).ToList();

            var count = string.IsNullOrWhiteSpace(model.Filter) ?
                            dataContext.Documents.LongCount(d =>
                                d.UserId == userId ||
                                d.Shares.Any(s => s.UserId == userId)) :
                            dataContext.Documents.LongCount(d =>
                                (d.UserId == userId ||
                                d.Shares.Any(s => s.UserId == userId)) &&
                                d.Title.Contains(model.Filter));

            return new PagedQueryResult<DocumentRead>(data, count);
        }

        public DocumentRead One(int id, Action notFound)
        {
            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var document = Query().FirstOrDefault(d => d.Id == id);

            if (document == null)
            {
                notFound();
            }

            return document;
        }

        public DocumentRead Create(DocumentEdit model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            var document = new Document().Merge(model);
            document.UserId = currentUserProvider.UserId;
            document.CreatedAt = document.UpdatedAt = Clock.UtcNow();

            dataContext.Documents.Add(document);
            dataContext.SaveChanges();

            return new DocumentRead
                       {
                           Id = document.Id,
                           Title = document.Title,
                           Content = document.Content,
                           Owned = true,
                           Shared = false,
                           Editable = true,
                           CreatedAt = document.CreatedAt,
                           UpdatedAt = document.UpdatedAt
                       };
        }

        public DocumentRead Update(int id, DocumentEdit model, Action notFound)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var userId = currentUserProvider.UserId;
            var ownedDocumentsQuery = dataContext.Documents
                .Where(d => d.Id == id && d.UserId == userId)
                .Select(d => new
                {
                    document = d,
                    shared = d.Shares.Any(),
                    owned = true
                });

            var sharedDocumentsQuery = dataContext.Documents
                .Where(d =>
                    d.Id == id &&
                    d.Shares.Any(s => s.UserId == userId && s.CanEdit))
                .Select(d => new
                {
                    document = d, 
                    shared = true,
                    owned = false
                });

            var info = ownedDocumentsQuery
                .Concat(sharedDocumentsQuery)
                .FirstOrDefault();

            if (info == null)
            {
                notFound();
                return null;
            }

            info.document.Merge(model);
            info.document.UpdatedAt = Clock.UtcNow();

            dataContext.SaveChanges();

            return new DocumentRead
                       {
                           Id = info.document.Id,
                           Title = info.document.Title,
                           Content = info.document.Content,
                           Owned = info.owned,
                           Shared = info.shared,
                           Editable = true,
                           CreatedAt = info.document.CreatedAt,
                           UpdatedAt = info.document.UpdatedAt
                       };
        }

        public void Delete(int id, Action notFound)
        {
            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var document = dataContext.Documents
                .FirstOrDefault(d =>
                    d.Id == id && d.UserId == currentUserProvider.UserId);

            if (document == null)
            {
                notFound();
                return;
            }

            dataContext.Documents.Remove(document);
            dataContext.SaveChanges();
        }

        private IQueryable<DocumentRead> Query()
        {
            var userId = currentUserProvider.UserId;

            var ownedDocumentsQuery = dataContext.Documents
                .Where(d => d.UserId == userId)
                .Select(d =>
                    new DocumentRead
                    {
                        Id = d.Id,
                        Title = d.Title,
                        Content = d.Content,
                        Owned = true,
                        Shared = d.Shares.Any(),
                        Editable = true,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt
                    });

            var sharedDocumentsQuery = dataContext.Shares
                .Where(s => s.UserId == userId)
                .Select(s =>
                    new DocumentRead
                    {
                        Id = s.Document.Id,
                        Title = s.Document.Title,
                        Content = s.Document.Content,
                        Owned = false,
                        Shared = true,
                        Editable = s.CanEdit,
                        CreatedAt = s.Document.CreatedAt,
                        UpdatedAt = s.Document.UpdatedAt
                    })
                    .Distinct();

            var documents = ownedDocumentsQuery.Concat(sharedDocumentsQuery);

            return documents;
        }
    }
}