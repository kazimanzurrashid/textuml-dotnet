namespace TextUml.Controllers
{
    using System;
    using System.Globalization;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;

    using Microsoft.AspNet.Identity.EntityFramework;

    using DomainObjects;
    using Models;
    using Infrastructure;
    using Services;

    [CLSCompliant(false)]
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

            var email = model.Email.ToLower(CultureInfo.CurrentCulture);
            var requireActivation = !IsDebuggingEnabled;

            try
            {
                var token = await membershipService.InternalSignup(
                    email,
                    model.Password,
                    UserRoles.User,
                    requireActivation);

                if (requireActivation)
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
                    await newUserConfirmedHandler.Handle(email);
                }

                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            catch (IdentityException e)
            {
                ModelState.AddModelError(string.Empty, e);

                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest, ModelState);
            }
        }
    }
}