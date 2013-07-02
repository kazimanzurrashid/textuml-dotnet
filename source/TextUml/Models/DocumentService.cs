namespace TextUml.Models
{
    using System;
    using System.Linq;
    using System.Linq.Dynamic;

    using DataAccess;
    using DomainObjects;
    using Extensions;
    using Infrastructure;

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
        private readonly int userId;

        public DocumentService(IDataContext dataContext, Func<int> getUserId)
        {
            this.dataContext = dataContext;
            userId = getUserId();
        }

        public PagedQueryResult<DocumentRead> Query(DocumentsQuery model)
        {
            var documents = Query();

            if (!string.IsNullOrWhiteSpace(model.Filter))
            {
                // ReSharper disable ImplicitlyCapturedClosure
                documents = documents.Where(d => d.Title.Contains(model.Filter));
                // ReSharper restore ImplicitlyCapturedClosure
            }

            documents = documents.OrderBy(model.GetOrderByClause());

            if (model.Skip > 0)
            {
                documents = documents.Skip(model.Skip);
            }

            var data = documents.Take(model.Top).ToList();

            var count = string.IsNullOrWhiteSpace(model.Filter) ?
                dataContext.Documents.LongCount(d =>
                    d.UserId == userId || d.Shares.Any(s => s.UserId == userId)) :
                dataContext.Documents.LongCount(d =>
                    (d.UserId == userId || d.Shares.Any(s => s.UserId == userId)) &&
                    d.Title.Contains(model.Filter));

            return new PagedQueryResult<DocumentRead>(data, count);
        }

        public DocumentRead One(int id, Action notFound)
        {
            var document = Query().FirstOrDefault(d => d.Id == id);

            if (document == null)
            {
                notFound();
            }

            return document;
        }

        public DocumentRead Create(DocumentEdit model)
        {
            var document = new Document().Merge(model);
            document.UserId = userId;
            document.CreatedAt = document.UpdatedAt = Clock.UtcNow();

            dataContext.Documents.Add(document);
            dataContext.SaveChanges();

            return new DocumentRead
                       {
                           Id = document.Id,
                           Title = document.Title,
                           Content = document.Content,
                           Owned = true,
                           Editable = true,
                           CreatedAt = document.CreatedAt,
                           UpdatedAt = document.UpdatedAt
                       };
        }

        public DocumentRead Update(int id, DocumentEdit model, Action notFound)
        {
            var ownedDocumentsQuery = dataContext.Documents
                .Where(d => d.Id == id && d.UserId == userId)
                .Select(d => new { document = d, owned = true });

            var sharedDocumentsQuery = dataContext.Documents
                .Where(d =>
                    d.Id == id &&
                    d.Shares.Any(s =>
                        s.UserId == userId &&
                        (s.Permissions & Permissions.Write) ==
                        Permissions.Write))
                .Select(d => new { document = d, owned = false });

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

            dataContext.MarkAsModified(info.document);
            dataContext.SaveChanges();

            return new DocumentRead
                       {
                           Id = info.document.Id,
                           Title = info.document.Title,
                           Content = info.document.Content,
                           Owned = info.owned,
                           Editable = true,
                           CreatedAt = info.document.CreatedAt,
                           UpdatedAt = info.document.UpdatedAt
                       };
        }

        public void Delete(int id, Action notFound)
        {
            var document = dataContext.Documents
                .FirstOrDefault(d => d.Id == id && d.UserId == userId);

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
            var ownedDocumentsQuery = dataContext
                .Documents
                .Where(d => d.UserId == userId)
                .Select(d =>
                    new DocumentRead
                    {
                       Id = d.Id,
                       Title = d.Title,
                       Content = d.Content,
                       Owned = true,
                       Editable = true,
                       CreatedAt = d.CreatedAt,
                       UpdatedAt = d.UpdatedAt
                    });

            var sharedDocumentsQuery = dataContext.Shares
                .Where(s => s.UserId == userId)
                .Select(s => new
                    {
                        share = s,
                        document = s.Document
                    })
                .Select(x => new DocumentRead
                    {
                        Id = x.document.Id,
                        Title = x.document.Title,
                        Content = x.document.Content,
                        Owned = false,
                        Editable = (x.share.Permissions & Permissions.Write) == Permissions.Write,
                        CreatedAt = x.document.CreatedAt,
                        UpdatedAt = x.document.UpdatedAt
                    })
                .Distinct();

            var documents = ownedDocumentsQuery.Concat(sharedDocumentsQuery);

            return documents;
        }
    }
}