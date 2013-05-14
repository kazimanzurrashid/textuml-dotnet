namespace TextUml.Hubs
{
    using System;

    using Microsoft.AspNet.SignalR;

    [CLSCompliant(false)]
    public class SharingHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }
    }
}