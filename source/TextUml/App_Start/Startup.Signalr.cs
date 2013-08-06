namespace TextUml
{
    using Owin;

    public partial class Startup
    {
        public void ConfigureSignalr(IAppBuilder app)
        {
            app.MapHubs();
        }
    }
}