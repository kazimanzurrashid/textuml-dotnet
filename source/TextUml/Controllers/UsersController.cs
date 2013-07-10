namespace TextUml.Controllers
{
    using System.Globalization;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;
    using System.Web.Security;

    using Infrastructure;
    using Models;
    using Services;

    public class UsersController : ApiController
    {
        private readonly IMembershipService membershipService;
        private readonly IMailer mailer;
        private readonly IUrlSafeSecureDataSerializer urlSafeSecureDataSerializer;
        private readonly INewUserConfirmedHandler newUserConfirmedHandler;

        private bool? debuggingEnabled;

        public UsersController(
            IMembershipService membershipService,
            IMailer mailer,
            IUrlSafeSecureDataSerializer urlSafeSecureDataSerializer,
            INewUserConfirmedHandler newUserConfirmedHandler)
        {
            this.membershipService = membershipService;
            this.mailer = mailer;
            this.urlSafeSecureDataSerializer = urlSafeSecureDataSerializer;
            this.newUserConfirmedHandler = newUserConfirmedHandler;
        }

        public bool IsDebuggingEnabled
        {
            get
            {
                if (debuggingEnabled == null)
                {
                    object context;

                    if (Request.Properties.TryGetValue("MS_HttpContext", out context))
                    {
                        var httpContext = context as HttpContextBase;

                        debuggingEnabled = (httpContext != null) && httpContext.IsDebuggingEnabled;
                    }
                    else
                    {
                        debuggingEnabled = false;
                    }
                }

                return debuggingEnabled.GetValueOrDefault();
            }

            set
            {
                debuggingEnabled = value;
            }
        }

        public async Task<HttpResponseMessage> Post(CreateUser model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest, ModelState);
            }

            var statusCode = MembershipCreateStatus.Success;
            var email = model.Email.ToLower(CultureInfo.CurrentCulture);
            var token = string.Empty;

            var requireConfirmation = !IsDebuggingEnabled;

            try
            {
                token = membershipService.Signup(
                    email,
                    model.Password,
                    requireConfirmation);
            }
            catch (MembershipCreateUserException e)
            {
                statusCode = e.StatusCode;
            }

            if (statusCode == MembershipCreateStatus.Success)
            {
                if (requireConfirmation)
                {
                    var userConfirmationToken = new UserConfirmationToken
                                                    {
                                                        Email = email,
                                                        Token = token
                                                    };

                    var securedToken = urlSafeSecureDataSerializer.Serialize(
                        userConfirmationToken);

                    await mailer.UserConfirmationAsync(email, securedToken);
                }
                else
                {
                    newUserConfirmedHandler.Handle(email);
                }

                return Request.CreateResponse(HttpStatusCode.NoContent);
            }

            switch (statusCode)
            {
                case MembershipCreateStatus.DuplicateUserName:
                case MembershipCreateStatus.DuplicateEmail:
                case MembershipCreateStatus.DuplicateProviderUserKey:
                    ModelState.AddModelError(
                        "email",
                        "User with same email already exits.");
                    break;
                case MembershipCreateStatus.InvalidUserName:
                case MembershipCreateStatus.InvalidEmail:
                    ModelState.AddModelError(
                        "email",
                        "Invalid email address.");
                    break;
                case MembershipCreateStatus.InvalidPassword:
                    ModelState.AddModelError("password", "Invalid password.");
                    break;
                default:
                    ModelState.AddModelError(
                        string.Empty,
                        "Unexpected error.");
                    break;
            }

            return Request.CreateErrorResponse(
                HttpStatusCode.BadRequest, ModelState);
        }
    }
}