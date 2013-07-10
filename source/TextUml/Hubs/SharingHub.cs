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
        // For the time being use in memory, for production redis would 
        // be a better option.
        private static readonly ConcurrentDictionary<string, string>
            DocumentContents = new ConcurrentDictionary<string, string>();

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
            if (!service.CanView(documentId))
            {
                return;
            }

            var id = documentId.ToString(CultureInfo.CurrentCulture);

            await Groups.Add(Context.ConnectionId, id);

            Clients.OthersInGroup(id).subscribed(documentId, UserName);

            string content;

            if (DocumentContents.TryGetValue(id, out content))
            {
                Clients.OthersInGroup(id)
                    .updated(documentId, content, UserName);
            }
        }

        public void Update(int documentId, string content)
        {
            if (!service.CanEdit(documentId))
            {
                return;
            }

            var id = documentId.ToString(CultureInfo.CurrentCulture);

            DocumentContents.AddOrUpdate(id, content, (key, value) => content);

            Clients.OthersInGroup(id).updated(documentId, content, UserName);
        }

        public async Task Unsubscribe(int documentId)
        {
            var id = documentId.ToString(CultureInfo.CurrentCulture);

            await Groups.Remove(Context.ConnectionId, id);

            Clients.OthersInGroup(id).unsubscribed(documentId, UserName);
        }
    }
}