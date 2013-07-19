namespace TextUml.Hubs
{
    using System;
    using System.Collections.Concurrent;
    using System.Globalization;
    using System.Threading.Tasks;

    using Microsoft.AspNet.SignalR;

    using Services;

    [Authorize, CLSCompliant(false)]
    public class SharingHub : Hub
    {
        // For the time being use in memory hash, for production redis would 
        // be a better option.
        private static readonly ConcurrentDictionary<string, DocumentEntry>
            DocumentContents = new ConcurrentDictionary<string, DocumentEntry>();

        private readonly IShareService service;

        public SharingHub(IShareService service)
        {
            this.service = service;
        }

        private string UserName
        {
            get
            {
                var fullname = Context.User.Identity.Name;

                var names = fullname.Split(
                        new[] { '@' },
                        StringSplitOptions.RemoveEmptyEntries);

                return names.Length > 1 ? names[0] : fullname;
            }
        }

        public async Task Subscribe(int documentId)
        {
            var canView = await service.CanView(documentId);

            if (!canView)
            {
                return;
            }

            var id = documentId.ToString(CultureInfo.CurrentCulture);

            await Groups.Add(Context.ConnectionId, id);

            Clients.OthersInGroup(id).subscribed(documentId, UserName);

            DocumentEntry entry;

            if (DocumentContents.TryGetValue(id, out entry))
            {
                Clients.Caller.updated(
                    documentId,
                    entry.Content,
                    entry.UpdatedBy);
            }
        }

        public async Task Update(int documentId, string content)
        {
            var canEdit = await service.CanEdit(documentId);

            if (!canEdit)
            {
                return;
            }

            var id = documentId.ToString(CultureInfo.CurrentCulture);

            var entry = new DocumentEntry
                            {
                                Content = content,
                                UpdatedBy = UserName
                            };

            DocumentContents.AddOrUpdate(id, entry, (key, value) => entry);

            Clients.OthersInGroup(id).updated(
                documentId,
                entry.Content,
                entry.UpdatedBy);
        }

        public async Task Unsubscribe(int documentId)
        {
            var id = documentId.ToString(CultureInfo.CurrentCulture);

            await Groups.Remove(Context.ConnectionId, id);

            Clients.OthersInGroup(id).unsubscribed(documentId, UserName);
        }

        private sealed class DocumentEntry
        {
            public string Content { get; set; }

            public string UpdatedBy { get; set; }
        }
    }
}