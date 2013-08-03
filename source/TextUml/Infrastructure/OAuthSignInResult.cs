namespace TextUml.Infrastructure
{
    using System.Web.Mvc;

    using Microsoft.Web.WebPages.OAuth;

    public class OAuthSignInResult : ActionResult
    {
        public OAuthSignInResult(string provider, string returnUrl)
        {
            this.Provider = provider;
            this.ReturnUrl = returnUrl;
        }

        public string Provider { get; private set; }

        public string ReturnUrl { get; private set; }

        public override void ExecuteResult(ControllerContext context)
        {
            OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
        }
    }
}