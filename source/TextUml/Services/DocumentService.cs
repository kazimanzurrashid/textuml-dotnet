namespace TextUml.Services
{
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Threading.Tasks;

    using DataAccess;
    using DomainObjects;
    using Extensions;
    using Infrastructure;
    using Models;

    public interface IDocumentService
    {
        Task<PagedQueryResult<DocumentRead>> Query(DocumentsQuery model);

        Task<DocumentRead> One(int id, Action notFound);

        Task<DocumentRead> Create(DocumentEdit model);

        Task<DocumentRead> Update(int id, DocumentEdit model, Action notFound);

        Task Delete(int id, Action notFound);
    }

    [CLSCompliant(false)]
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

        public async Task<PagedQueryResult<DocumentRead>> Query(DocumentsQuery model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            var userId = currentUserProvider.GetUserId();
            var documents = Query(userId);

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

            var data = await documents.Take(model.Top).ToListAsync();

            var count = string.IsNullOrWhiteSpace(model.Filter) ?
                            // ReSharper disable ImplicitlyCapturedClosure
                            await dataContext.Documents.LongCountAsync(d =>
                            // ReSharper restore ImplicitlyCapturedClosure
                                d.UserId == userId ||
                                d.Shares.Any(s => s.UserId == userId)) :
                            await dataContext.Documents.LongCountAsync(d =>
                                (d.UserId == userId ||
                                d.Shares.Any(s => s.UserId == userId)) &&
                                d.Title.Contains(model.Filter));

            return new PagedQueryResult<DocumentRead>(data, count);
        }

        public async Task<DocumentRead> One(int id, Action notFound)
        {
            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var userId = currentUserProvider.GetUserId();

            var document = await Query(userId)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (document == null)
            {
                notFound();
            }

            return document;
        }

        public async Task<DocumentRead> Create(DocumentEdit model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            var userId = currentUserProvider.GetUserId();
            var document = new Document().Merge(model);
            document.UserId = userId;
            document.CreatedAt = document.UpdatedAt = Clock.UtcNow();

            dataContext.Documents.Add(document);
            await dataContext.SaveChangesAsync();

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

        public async Task<DocumentRead> Update(int id, DocumentEdit model, Action notFound)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var userId = currentUserProvider.GetUserId();

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

            var info = await ownedDocumentsQuery
                .Concat(sharedDocumentsQuery)
                .FirstOrDefaultAsync();

            if (info == null)
            {
                notFound();
                return null;
            }

            info.document.Merge(model);
            info.document.UpdatedAt = Clock.UtcNow();

            await dataContext.SaveChangesAsync();

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

        public async Task Delete(int id, Action notFound)
        {
            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var userId = currentUserProvider.GetUserId();

            var document = await dataContext.Documents
                .FirstOrDefaultAsync(d =>
                    d.Id == id && d.UserId == userId);

            if (document == null)
            {
                notFound();
                return;
            }

            dataContext.Documents.Remove(document);
            await dataContext.SaveChangesAsync();
        }

        private IQueryable<DocumentRead> Query(string userId)
        {
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