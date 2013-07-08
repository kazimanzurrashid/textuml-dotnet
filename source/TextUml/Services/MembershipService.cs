namespace TextUml.Services
{
    using System;
    using System.Web.Security;

    using WebMatrix.WebData;

    using DomainObjects;

    public interface IMembershipService
    {
        bool SignIn(string email, string password, bool persist);

        void SignOut();

        string Signup(
            string email,
            string password,
            bool requireConfirmation);

        bool Confirm(string email, string token);

        string ForgotPassword(string email);

        bool ResetPassword(string token, string password);

        bool ChangePassword(
            string userName,
            string oldPassword,
            string newPassword);
    }

    public class MembershipService : IMembershipService
    {
        public bool SignIn(string email, string password, bool persist)
        {
            return WebSecurity.Login(email, password, persist);
        }

        public void SignOut()
        {
            WebSecurity.Logout();
        }

        public string Signup(
            string email,
            string password,
            bool requireConfirmation)
        {
            var token = WebSecurity.CreateUserAndAccount(
                email,
                password,
                requireConfirmationToken: requireConfirmation);

            Roles.AddUserToRole(email, User.Roles.User);

            return token;
        }

        public bool Confirm(string email, string token)
        {
            return WebSecurity.ConfirmAccount(email, token);
        }

        public string ForgotPassword(string email)
        {
            try
            {
                return WebSecurity.GeneratePasswordResetToken(email);
            }
            catch (InvalidOperationException)
            {
                // Throws when user does not exists,
                // and we do not want to disclose user's email.
            }

            return null;
        }

        public bool ResetPassword(string token, string password)
        {
            return WebSecurity.ResetPassword(token, password);
        }

        public bool ChangePassword(
            string userName,
            string oldPassword,
            string newPassword)
        {
            return WebSecurity.ChangePassword(
                userName,
                oldPassword,
                newPassword);
        }
    }
}