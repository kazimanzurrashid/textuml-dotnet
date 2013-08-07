namespace TextUml.Infrastructure
{
    using System;
    using System.Security.Cryptography;
    using System.Threading.Tasks;
    using System.Web;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    using DataAccess;
    using DomainObjects;

    [CLSCompliant(false)]
    public class AppIdentityStoreManager : IdentityStoreManager
    {
        private readonly AppIdentityStoreContext context;

        public AppIdentityStoreManager(AppIdentityStoreContext storeContext) :
            base(storeContext)
        {
            context = storeContext;
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

            string error;

            if (!this.UserNameValidator.Validate(user.UserName, out error))
            {
                throw new IdentityException(error);
            }
        }
    }
}