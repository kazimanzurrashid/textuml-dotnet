namespace TextUml.Controllers
{
    using System;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    using Infrastructure;
    using Models;
    using Services;

    public class SupportsController : Controller
    {
        private readonly IMembershipService membershipService;
        private readonly IUrlSafeSecureDataSerializer
            urlSafeSecureDataSerializer;

        private readonly INewUserConfirmedHandler newUserConfirmedHandler;

        private FlashMessageCollection flash;

        public SupportsController(
            IMembershipService membershipService,
            IUrlSafeSecureDataSerializer urlSafeSecureDataSerializer,
            INewUserConfirmedHandler newUserConfirmedHandler)
        {
            this.membershipService = membershipService;
            this.urlSafeSecureDataSerializer = urlSafeSecureDataSerializer;
            this.newUserConfirmedHandler = newUserConfirmedHandler;
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

        [HttpGet]
        public async Task<ActionResult> ConfirmUser(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return RedirectToHome();
            }

            var userConfirmationToken = urlSafeSecureDataSerializer
                .Deserialize<UserConfirmationToken>(token);

            if (membershipService.Confirm(
                userConfirmationToken.Email,
                userConfirmationToken.Token))
            {
                await newUserConfirmedHandler.Handle(userConfirmationToken.Email);
                Flash[FlashMessageType.Success] = "Your account is now " +
                    "successfully verified.";
            }
            else
            {
                Flash[FlashMessageType.Error] = "Invalid confirmation " +
                    "token, you may have miss typed the token or the " +
                    "token has expired.";
            }

            return RedirectToHome();
        }

        [HttpGet]
        public ActionResult ResetPassword(string token)
        {
            return View(new ResetPassword { Token = token });
        }

        [HttpPost, ValidateAntiForgeryToken]
        public ActionResult ResetPassword(ResetPassword model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (membershipService.ResetPassword(model.Token, model.Password))
            {
                Flash[FlashMessageType.Success] = "Your password is " +
                    "successfully changed.";
            }
            else
            {
                Flash[FlashMessageType.Error] = "Invalid reset token, " +
                    "you may have miss typed the token or the token has " +
                    "expired.";
            }

            return RedirectToHome();
        }

        private ActionResult RedirectToHome()
        {
            return RedirectToAction("index", "home");
        }
    }
}