namespace TextUml.Services
{
    using System;
    using System.Data.Entity;
    using System.Threading.Tasks;
    using System.Web;

    using Microsoft.AspNet.Identity.EntityFramework;

    using DataAccess;
    using Infrastructure;

    [CLSCompliant(false)]
    public interface IMembershipService
    {
        AppIdentityAuthenticationManager AuthenticationManager { get; }

        Task CreateRoles(params string[] role);

        Task<bool> InternalSignIn(string email, string password, bool persist);

        Task<bool> ExternalSignIn(
            string provider,
            string userName,
            string role,
            bool persist);

        void SignOut();

        Task<string> Signup(
            string email,
            string password,
            string role,
            bool requiresActivation);

        Task<bool> Activate(string email, string token);

        Task<string> ForgotPassword(string email);

        Task<bool> ResetPassword(string token, string password);

        Task<bool> ChangePassword(
            string email,
            string oldPassword,
            string newPassword);

        Task<bool> InternalUserExists(string email);
    }

    [CLSCompliant(false)]
    public class MembershipService : IMembershipService
    {
        private readonly DataContext dataContext;

        public MembershipService(
            DataContext dataContext,
            Func<HttpContextBase> lazyHttpContext)
        {
            this.dataContext = dataContext;
            LazyHttpContext = lazyHttpContext;

            var identityContext = new AppIdentityStoreContext(dataContext);
            IdentityManager = new AppIdentityStoreManager(identityContext);
            AuthenticationManager = new AppIdentityAuthenticationManager(
                IdentityManager);
        }

        public AppIdentityAuthenticationManager AuthenticationManager
        {
            get; protected set;
        }

        protected Func<HttpContextBase> LazyHttpContext { get; private set; }

        protected AppIdentityStoreManager IdentityManager { get; set; }

        public async Task CreateRoles(params string[] role)
        {
            foreach (var name in role)
            {
                await IdentityManager.Context.Roles.CreateRole(new Role(name));
            }

            await IdentityManager.Context.SaveChanges();
        }

        public async Task<bool> InternalSignIn(
            string email,
            string password,
            bool persist)
        {
            return await AuthenticationManager.CheckPasswordAndSignIn(
                LazyHttpContext(),
                email,
                password,
                persist);
        }

        public async Task<bool> ExternalSignIn(
            string provider,
            string userName,
            string role,
            bool persist)
        {
            var user = new User(userName);

            return await AuthenticationManager
                .CreateAndSignInExternalUser(
                    LazyHttpContext(),
                    provider,
                    user,
                    role,
                    persist);
        }

        public void SignOut()
        {
            AuthenticationManager.SignOut(LazyHttpContext());
        }

        public async Task<string> Signup(
            string email,
            string password,
            string role,
            bool requiresActivation)
        {
            var user = new User(email);

            var token = await IdentityManager.CreateLocalUser(
                user,
                password,
                role,
                requiresActivation);

            return token;
        }

        public async Task<bool> Activate(string email, string token)
        {
            var userId = await IdentityManager.GetUserIdForLocalLogin(email);

            if (userId == null)
            {
                return false;
            }

            var activation = await dataContext.Tokens.FindAsync(userId);

            if ((activation == null) || !activation.CanActivate(token))
            {
                return false;
            }

            activation.MarkActivated();

            await dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<string> ForgotPassword(string email)
        {
            var userId = await IdentityManager.GetUserIdForLocalLogin(email);

            if (userId == null)
            {
                return null;
            }

            var token = await dataContext.Tokens.FindAsync(userId);

            token.GenerateResetPasswordToken();

            await dataContext.SaveChangesAsync();

            return token.ResetPasswordToken;
        }

        public async Task<bool> ResetPassword(string token, string password)
        {
            var reset = await dataContext.Tokens
                .FirstOrDefaultAsync(t => t.ResetPasswordToken == token);

            if (reset == null || reset.HasResetPasswordTokenExpired)
            {
                return false;
            }

            var user = await IdentityManager.Context.Users.Find(reset.UserId);

            if (user == null)
            {
                return false;
            }

            var hasChanged = await IdentityManager.ChangePassword(
                user.UserName,
                password,
                password);

            if (hasChanged)
            {
                reset.ExpireResetPasswordToken();
                await dataContext.SaveChangesAsync();
            }

            return hasChanged;
        }

        public async Task<bool> ChangePassword(
            string email,
            string oldPassword,
            string newPassword)
        {
            return await IdentityManager.ChangePassword(
                email,
                oldPassword,
                newPassword);
        }

        public async Task<bool> InternalUserExists(string email)
        {
            var id = await IdentityManager.GetUserIdForLocalLogin(email);

            return id != null;
        }
    }
}