namespace TextUml.Hubs
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNet.SignalR;

    [CLSCompliant(false)]
    public class SharingHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public override Task OnConnected()
        {
            System.Diagnostics.Debug.Write(this.Context.ConnectionId);
            return base.OnConnected();
        }

        public override Task OnReconnected()
        {
            System.Diagnostics.Debug.Write(this.Context.ConnectionId);
            return base.OnReconnected();
        }
    }
}