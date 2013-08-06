namespace TextUml.Controllers
{
    using System;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    using Microsoft.AspNet.Identity.EntityFramework;

    using DomainObjects;
    using Infrastructure;

    using Services;

    [CLSCompliant(false)]
    public class OAuthController : Controller
    {
        private readonly IMembershipService membershipService;

        private FlashMessageCollection flash;

        public OAuthController(IMembershipService membershipService)
        {
            this.membershipService = membershipService;
        }

        public FlashMessageCollection Flash
        {
            get
            {
                return flash ?? (flash = new FlashMessageCollection(TempData));
            }

            set
            {
                flash = value;
            }
        }

        [HttpPost]
        public ActionResult SignIn(string provider)
        {
            return string.IsNullOrWhiteSpace(provider) ?
                RedirectToHome() :
                new ChallengeResult(
                    provider,
                    Url.Action("callback", new { provider }),
                    membershipService.AuthenticationManager);
        }

        [HttpGet]
        public async Task<ActionResult> Callback(string provider)
        {
            var authentication = membershipService.AuthenticationManager;
            var claim = await authentication.GetExternalIdentity(HttpContext);

            if (!authentication.VerifyExternalIdentity(claim, provider))
            {
                Flash[FlashMessageType.Error] = "Failed to sign in.";
                return RedirectToHome();
            }

            if (await authentication.SignInExternalIdentity(HttpContext, claim, provider))
            {
                Flash[FlashMessageType.Success] = "You are now signed in.";
            }
            else if (await membershipService.ExternalSignup(
                    provider,
                    claim.Name,
                    UserRoles.User))
                {
                    Flash[FlashMessageType.Success] = "You are now signed in.";
                }
            else
            {
                Flash[FlashMessageType.Error] = "Failed to sign in.";
            }

            return RedirectToHome();
        }

        private ActionResult RedirectToHome()
        {
            return RedirectToAction("index", "home");
        }

        private class ChallengeResult : HttpUnauthorizedResult
        {
            private readonly string provider;
            private readonly string redirectUrl;
            private readonly IdentityAuthenticationManager authentication;

            public ChallengeResult(
                string provider, 
                string redirectUrl, 
                IdentityAuthenticationManager authentication)
            {
                this.provider = provider;
                this.redirectUrl = redirectUrl;
                this.authentication = authentication;
            }

            public override void ExecuteResult(ControllerContext context)
            {
                authentication.Challenge(
                    context.HttpContext,
                    provider,
                    redirectUrl);
            }
        }
    }
}