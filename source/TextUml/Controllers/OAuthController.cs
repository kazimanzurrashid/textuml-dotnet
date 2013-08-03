namespace TextUml.Controllers
{
    using System.Data.Entity;
    using System.Globalization;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using System.Web.Security;

    using Microsoft.Web.WebPages.OAuth;

    using DataAccess;
    using DomainObjects;
    using Infrastructure;

    using UserRoles = DomainObjects.User.Roles;

    public class OAuthController : Controller
    {
        private readonly IDataContext dataContext;

        private FlashMessageCollection flash;

        public OAuthController(IDataContext dataContext)
        {
            this.dataContext = dataContext;
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
                new OAuthSignInResult(provider, Url.Action("callback"));
        }

        [HttpGet]
        public async Task<ActionResult> Callback()
        {
            var result = OAuthWebSecurity.VerifyAuthentication(
                Url.Action("callback"));

            if (!result.IsSuccessful)
            {
                Flash[FlashMessageType.Error] = "Failed to sign in.";
                return RedirectToHome();
            }

            var email = (result.UserName +
                "@oauth-" +
                result.Provider +
                ".com").ToLower(CultureInfo.CurrentCulture);

            var userExists = await dataContext.Users
                .AnyAsync(u => u.Email == email);

            if (!userExists)
            {
                var user = new User { Email = email };
                dataContext.Users.Add(user);
                await dataContext.SaveChangesAsync();
                Roles.AddUserToRole(email, UserRoles.User);
            }

            OAuthWebSecurity.CreateOrUpdateAccount(
                result.Provider,
                result.ProviderUserId,
                email);

            OAuthWebSecurity.Login(
                result.Provider,
                result.ProviderUserId,
                false);

            Flash[FlashMessageType.Success] = "You are now signed in.";

            return RedirectToHome();
        }

        private ActionResult RedirectToHome()
        {
            return RedirectToAction("index", "home");
        }
    }
}