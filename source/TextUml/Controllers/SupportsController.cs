namespace TextUml.Controllers
{
    using System;
    using System.Web.Mvc;

    using Infrastructure;
    using Models;

    public class SupportsController : Controller
    {
        private readonly Func<string, string, bool> confirmUser;
        private readonly Func<string, string, bool> resetPassword;
        private readonly IUrlSafeSecureDataSerializer urlSafeSecureDataSerializer;

        private FlashMessages flash;

        public SupportsController(
            Func<string, string, bool> confirmUser,
            Func<string, string, bool> resetPassword,
            IUrlSafeSecureDataSerializer urlSafeSecureDataSerializer)
        {
            this.confirmUser = confirmUser;
            this.resetPassword = resetPassword;
            this.urlSafeSecureDataSerializer = urlSafeSecureDataSerializer;
        }

        public FlashMessages Flash
        {
            get { return flash ?? (flash = new FlashMessages(TempData)); }

            set { flash = value; }
        }

        [HttpGet]
        public ActionResult ConfirmUser(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return RedirectToHome();
            }

            var userConfirmationToken = urlSafeSecureDataSerializer
                .Deserialize<UserConfirmationToken>(token);

            if (confirmUser(
                userConfirmationToken.Email,
                userConfirmationToken.Token))
            {
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
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (resetPassword(model.Token, model.Password))
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
            return RedirectToAction("index", "Home");
        }
    }
}