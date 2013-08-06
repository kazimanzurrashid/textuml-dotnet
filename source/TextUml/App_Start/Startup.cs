namespace TextUml
{
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuthtication(app);
            ConfigureSignalr(app);
        }
    }
}