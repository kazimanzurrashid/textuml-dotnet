namespace TextUml.Models
{
    using System;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Linq.Expressions;

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
        private static readonly Expression<Func<Document, DocumentRead>>
            MapExpression = d =>
            new DocumentRead
                {
                    Id = d.Id,
                    Title = d.Title,
                    Content = d.Content,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                };

        private static readonly Func<Document, DocumentRead> Map = MapExpression.Compile();
 
        private readonly IDataContext dataContext;
        private readonly int userId;

        public DocumentService(IDataContext dataContext, Func<int> getUserId)
        {
            this.dataContext = dataContext;
            userId = getUserId();
        }

        public PagedQueryResult<DocumentRead> Query(DocumentsQuery model)
        {
            var query = dataContext.Documents
                .Where(d => d.UserId == userId)
                .Select(MapExpression)
                .OrderBy(model.GetOrderByClause());

            if (!string.IsNullOrWhiteSpace(model.Filter))
            {
                query = query.Where(d => d.Title.Contains(model.Filter));
            }

            if (model.Skip > 0)
            {
                query = query.Skip(model.Skip);
            }

            var data = query.Take(model.Top)
                .ToList();

            var count = string.IsNullOrWhiteSpace(model.Filter) ?
                dataContext.Documents.LongCount(d => d.UserId == userId) :
                dataContext.Documents.LongCount(d =>
                    d.UserId == userId && d.Title.Contains(model.Filter));

            return new PagedQueryResult<DocumentRead>(data, count);
        }

        public DocumentRead One(int id, Action notFound)
        {
            var document = Get(id, notFound);

            return document == null ? null : Map(document);
        }

        public DocumentRead Create(DocumentEdit model)
        {
            var document = new Document().Merge(model);
            document.UserId = userId;
            document.CreatedAt = document.UpdatedAt = Clock.UtcNow();

            dataContext.Documents.Add(document);
            dataContext.SaveChanges();

            return Map(document);
        }

        public DocumentRead Update(int id, DocumentEdit model, Action notFound)
        {
            var document = Get(id, notFound);

            if (document == null)
            {
                return null;
            }

            document.Merge(model);
            document.UpdatedAt = Clock.UtcNow();

            dataContext.MarkAsModified(document);
            dataContext.SaveChanges();

            return Map(document);
        }

        public void Delete(int id, Action notFound)
        {
            var document = Get(id, notFound);

            if (document == null)
            {
                return;
            }

            dataContext.Documents.Remove(document);
            dataContext.SaveChanges();
        }

        private Document Get(int id, Action notFound)
        {
            var document = dataContext.Documents
                .FirstOrDefault(d => d.Id == id && d.UserId == userId);

            if (document == null)
            {
                notFound();
            }

            return document;
        }
    }
}