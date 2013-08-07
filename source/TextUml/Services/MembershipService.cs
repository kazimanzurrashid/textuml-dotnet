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
        IdentityAuthenticationManager AuthenticationManager { get; }

        Task CreateRoles(params string[] role);

        Task<bool> SignIn(string email, string password, bool persist);

        void SignOut();

        Task<string> InternalSignup(
            string email,
            string password,
            string role,
            bool requireActivation);

        Task<bool> ExternalSignup(string provider, string userName, string role);
 
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
            AuthenticationManager = new IdentityAuthenticationManager(
                IdentityManager);
        }

        public IdentityAuthenticationManager AuthenticationManager
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

        public async Task<bool> SignIn(
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

        public void SignOut()
        {
            AuthenticationManager.SignOut(LazyHttpContext());
        }

        public async Task<string> InternalSignup(
            string email,
            string password,
            string role,
            bool requireActivation)
        {
            var user = new User(email);

            var token = await IdentityManager.CreateLocalUser(
                user,
                password,
                requireActivation);

            await IdentityManager.Context.Roles.AddUserToRole(role, user.Id);
            await IdentityManager.Context.SaveChanges();

            return token;
        }

        public async Task<bool> ExternalSignup(
            string provider,
            string userName,
            string role)
        {
            var user = new User(userName);

            var result = await AuthenticationManager.CreateAndSignInExternalUser(
                LazyHttpContext(),
                provider,
                user);

            if (result)
            {
                await IdentityManager.Context.Roles.AddUserToRole(role, user.Id);
                await IdentityManager.Context.SaveChanges();
            }

            return result;
        }

        public async Task<bool> Activate(string email, string token)
        {
            var userId = await IdentityManager.GetUserIdForLocalLogin(email);

            if (userId == null)
            {
                return false;
            }

            var activation = await dataContext.Tokens.FirstOrDefaultAsync(t =>
                t.UserId == userId && 
                t.ActivatedAt == null);

            if ((activation == null) ||
                (activation.ActivationToken != token))
            {
                return false;
            }

            activation.ActivatedAt = Clock.UtcNow();
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

            var reset = await dataContext.Tokens.FirstOrDefaultAsync(t =>
                t.UserId == userId && 
                t.ActivatedAt != null);

            reset.ResetPasswordToken = AppIdentityStoreManager.GenerateToken();
            reset.ResetPasswordTokenExpiredAt = Clock.UtcNow().AddMinutes(1440);
            await dataContext.SaveChangesAsync();

            return reset.ResetPasswordToken;
        }

        public async Task<bool> ResetPassword(string token, string password)
        {
            var reset = await dataContext.Tokens.FirstOrDefaultAsync(t => 
                t.ActivatedAt != null &&
                t.ResetPasswordToken == token);

            if ((reset == null) ||
                (reset.ResetPasswordTokenExpiredAt > Clock.UtcNow()))
            {
                return false;
            }

            var user = await IdentityManager.Context.Users.Find(reset.UserId);

            if (user == null)
            {
                return false;
            }

            var result = await IdentityManager.ChangePassword(
                user.UserName,
                password,
                password);

            if (result)
            {
                reset.ResetPasswordTokenExpiredAt = Clock.UtcNow();
                await dataContext.SaveChangesAsync();
            }

            return result;
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
            return (await IdentityManager.GetUserIdForLocalLogin(email)) != null;
        }
    }
}