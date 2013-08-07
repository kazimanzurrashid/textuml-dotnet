namespace TextUml
{
    using System.Configuration;

    using Owin;

    public partial class Startup
    {
        public static void ConfigureAuthentication(IAppBuilder app)
        {
            app.UseSignInCookies();

            var settings = ConfigurationManager.AppSettings;

            app.UseGitHubAuthentication(
                settings["oAuth.github.clientId"],
                settings["oAuth.github.clientSecret"]);

            app.UseTwitterAuthentication(
                settings["oAuth.twitter.consumerKey"],
                settings["oAuth.twitter.consumerSecret"]);

            app.UseFacebookAuthentication(
                settings["oAuth.facebook.appId"],
                settings["oAuth.facebook.appSecret"]);

            app.UseGoogleAuthentication();
        }
    }
}