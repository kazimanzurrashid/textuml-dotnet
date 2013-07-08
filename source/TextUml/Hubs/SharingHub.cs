namespace TextUml.Hubs
{
    using System;
    using System.Globalization;

    using Microsoft.AspNet.SignalR;

    using TextUml.Services;

    [Authorize, CLSCompliant(false)]
    public class SharingHub : Hub
    {
        private readonly IShareService service;

        public SharingHub(IShareService service)
        {
            this.service = service;
        }

        public void Subscribe(int documentId)
        {
            var id = documentId.ToString(CultureInfo.CurrentCulture);

            Groups.Add(Context.ConnectionId, id);

            Clients.Group(id, Context.ConnectionId)
                .subscribed(documentId, Context.User.Identity.Name);
        }

        public void Update(int documentId, string content)
        {
            var id = documentId.ToString(CultureInfo.CurrentCulture);

            if (!service.CanEdit(documentId))
            {
                return;
            }

            Clients.Group(id, Context.ConnectionId)
                .updated(documentId, content, Context.User.Identity.Name);
        }

        public void Unsubscribe(int documentId)
        {
            var id = documentId.ToString(CultureInfo.CurrentCulture);

            Groups.Remove(Context.ConnectionId, id);

            Clients.Group(id, Context.ConnectionId)
                .unsubscribed(documentId, Context.User.Identity.Name);
        }
    }
}