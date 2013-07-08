namespace TextUml.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    using Infrastructure;
    using Models;
    using Services;

    public class PasswordsController : ApiController
    {
        private readonly IMembershipService membershipService;
        private readonly IMailer mailer;

        public PasswordsController(
            IMembershipService membershipService,
            IMailer mailer)
        {
            this.membershipService = membershipService;
            this.mailer = mailer;
        }

        public async Task<HttpResponseMessage> Forgot(ForgotPassword model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var email = model.Email.ToLowerInvariant();
            var token = membershipService.ForgotPassword(email);

            if (!string.IsNullOrWhiteSpace(token))
            {
                await mailer.ForgotPasswordAsync(email, token);
            }

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [Authorize]
        public HttpResponseMessage Change(ChangePassword model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            try
            {
                if (membershipService.ChangePassword(
                    User.Identity.Name,
                    model.OldPassword,
                    model.NewPassword))
                {
                    return Request.CreateResponse(HttpStatusCode.NoContent);
                }

                ModelState.AddModelError(
                    "oldPassword",
                    "Old password does not match existing password.");
            }
            catch (ArgumentException)
            {
                ModelState.AddModelError(
                    "newPassword",
                    "New password does not meet password rule.");
            }

            return Request.CreateErrorResponse(
                HttpStatusCode.BadRequest,
                ModelState);
        }
    }
}