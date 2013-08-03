namespace TextUml
{
    using System.Configuration;

    using Microsoft.Web.WebPages.OAuth;

    public static class OAuthConfig
    {
        public static void Register()
        {
            var settings = ConfigurationManager.AppSettings;

            OAuthWebSecurity.RegisterTwitterClient(
                settings["oAuth.twitter.consumerKey"],
                settings["oAuth.twitter.consumerSecret"]);

            OAuthWebSecurity.RegisterGoogleClient();
        }
    }
}