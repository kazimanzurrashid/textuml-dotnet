namespace TextUml.Hubs
{
    using System;
    using System.Globalization;
    using System.Threading.Tasks;

    using Microsoft.AspNet.SignalR;

    using Services;

    [Authorize, CLSCompliant(false)]
    public class SharingHub : Hub
    {
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
        }

        public void Update(int documentId, string content)
        {
            if (!service.CanEdit(documentId))
            {
                return;
            }

            var id = documentId.ToString(CultureInfo.CurrentCulture);

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