namespace TextUml
{
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuthentication(app);
            ConfigureSignalr(app);
        }
    }
}