namespace TextUml
{
    using Owin;

    public partial class Startup
    {
        public static void ConfigureSignalr(IAppBuilder app)
        {
            app.MapHubs();
        }
    }
}