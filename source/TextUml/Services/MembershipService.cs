namespace TextUml.Services
{
    using System;
    using System.Data.Entity;
    using System.Security.Cryptography;
    using System.Threading.Tasks;
    using System.Web;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    using DataAccess;
    using DomainObjects;
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
    public class MyUserSecretStore : IUserSecretStore
    {
        private readonly DataContext dataContext;
        private readonly UserSecretStore<UserSecret> store;

        public MyUserSecretStore(DataContext db)
        {
            dataContext = db;
            store = new UserSecretStore<UserSecret>(db);
        }

        public Task<bool> Delete(string userName)
        {
            return store.Delete(userName);
        }

        public Task<bool> Create(IUserSecret userSecret)
        {
            return store.Create(userSecret);
        }

        public Task<bool> Update(string userName, string newSecret)
        {
            return store.Update(userName, newSecret);
        }

        public async Task<bool> Validate(string userName, string loginSecret)
        {
            var activated = await dataContext.Tokens
                .AnyAsync(m =>
                    m.ActivatedAt != null && m.User.UserName == userName);

            if (!activated)
            {
                return false;
            }

            return await store.Validate(userName, loginSecret);
        }

        public Task<IUserSecret> Find(string userName)
        {
            return store.Find(userName);
        }
    }

    [CLSCompliant(false)]
    public class MyIdentityStoreContext : IdentityStoreContext
    {
        public MyIdentityStoreContext(DataContext dataContext) :
            base(dataContext)
        {
            this.Secrets = new MyUserSecretStore(dataContext);
        }
    }

    [CLSCompliant(false)]
    public class MyIdentityStoreManager : IdentityStoreManager
    {
        private readonly MyIdentityStoreContext context;

        public MyIdentityStoreManager(MyIdentityStoreContext storeContext) :
            base(storeContext)
        {
            this.context = storeContext;
        }

        public async Task<string> CreateLocalUser(
            IUser user,
            string password,
            bool requireActivation)
        {
            ValidateUser(user);

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("password");
            }

            string passwordError;

            if (!PasswordValidator.Validate(password, out passwordError))
            {
                throw new IdentityException(passwordError);
            }

            if (!(await context.Users.Create(user)))
            {
                return null;
            }

            if (!(await context.Secrets.Create(
                new UserSecret(user.UserName, password))))
            {
                return null;
            }

            if (!(await context.Logins.Add(
                new UserLogin(user.Id, LocalLoginProvider, user.UserName))))
            {
                return null;
            }

            var token = new Token { UserId = user.Id };

            if (requireActivation)
            {
                token.ActivationToken = GenerateToken();
            }
            else
            {
                token.ActivatedAt = Clock.UtcNow();
            }

            var dataContext = (DataContext)context.DbContext;
            dataContext.Tokens.Add(token);
            await dataContext.SaveChangesAsync();

            return token.ActivationToken;
        }

        public async override Task<bool> CreateExternalUser(
            IUser user,
            string loginProvider,
            string providerKey)
        {
            ValidateUser(user);

            if (!(await context.Users.Create(user)))
            {
                return false;
            }

            if (!(await context.Logins.Add(
                new UserLogin(user.Id, loginProvider, providerKey))))
            {
                return false;
            }

            var token = new Token
                            {
                                UserId = user.Id,
                                ActivatedAt = Clock.UtcNow()
                            };

            var dataContext = (DataContext)context.DbContext;
            dataContext.Tokens.Add(token);
            await dataContext.SaveChangesAsync();

            return true;
        }

        internal static string GenerateToken()
        {
            var buffer = new byte[16];

            using (var crypto = new RNGCryptoServiceProvider())
            {
                crypto.GetBytes(buffer);
            }

            return HttpServerUtility.UrlTokenEncode(buffer);
        }

        private void ValidateUser(IUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                throw new ArgumentException("user.UserName");
            }

            string userNameError;

            if (!UserNameValidator.Validate(user.UserName, out userNameError))
            {
                throw new IdentityException(userNameError);
            }
        }
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

            IdentityManager = new MyIdentityStoreManager(
                new MyIdentityStoreContext(dataContext));
            AuthenticationManager = new IdentityAuthenticationManager(
                IdentityManager);
        }

        public IdentityAuthenticationManager AuthenticationManager
        {
            get; protected set;
        }

        protected Func<HttpContextBase> LazyHttpContext { get; private set; }

        protected MyIdentityStoreManager IdentityManager { get; set; }

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

            reset.ResetPasswordToken = MyIdentityStoreManager.GenerateToken();
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