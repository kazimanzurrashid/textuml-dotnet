namespace TextUml.Hubs
{
    using System;
    using System.Globalization;

    using Microsoft.AspNet.SignalR;

    [Authorize, CLSCompliant(false)]
    public class SharingHub : Hub
    {
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