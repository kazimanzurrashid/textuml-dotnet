namespace TextUml.Infrastructure
{
    using System;
    using System.Data.Entity.Validation;
    using System.Globalization;
    using System.Text;
    using System.Threading.Tasks;

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
            string role,
            bool requiresActivation)
        {
            ValidateUser(user);
            ValidatePassword(password);

            if (await GetUserIdForLocalLogin(user.UserName) != null)
            {
                throw new IdentityException("User name already exists.");
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

            await context.Roles.AddUserToRole(role, user.Id);

            var token = new Token(user.Id, requiresActivation);

            ((DataContext)context.DbContext).Tokens.Add(token);

            await PersistChanges();

            return token.ActivationToken;
        }

        public async Task<bool> CreateExternalUser(
            IUser user,
            string logOnProvider,
            string providerKey,
            string role)
        {
            ValidateUser(user);

            if (!(await context.Users.Create(user)))
            {
                return false;
            }

            if (!(await context.Logins.Add(
                new UserLogin(user.Id, logOnProvider, providerKey))))
            {
                return false;
            }

            await context.Roles.AddUserToRole(role, user.Id);
            await PersistChanges();

            return true;
        }

        private static IdentityException GenerateIdentityException(
            DbEntityValidationException e)
        {
            var errorBuilder = new StringBuilder("Database Validation failed.");

            errorBuilder.AppendLine();

            foreach (var error in e.EntityValidationErrors)
            {
                errorBuilder.AppendFormat(
                    CultureInfo.CurrentUICulture,
                    "Entity Type {0} failed validation.",
                    error.Entry.Entity.GetType());

                errorBuilder.AppendLine();

                foreach (var validationError in error.ValidationErrors)
                {
                    errorBuilder.Append(validationError.ErrorMessage);
                    errorBuilder.AppendLine();
                }
            }

            return new IdentityException(errorBuilder.ToString());
        }

        private async Task PersistChanges()
        {
            try
            {
                await context.DbContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                throw GenerateIdentityException(e);
            }
        }

        private void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password is required.", "password");
            }

            string error;

            if (!PasswordValidator.Validate(password, out error))
            {
                throw new IdentityException(error);
            }
        }

        private void ValidateUser(IUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                throw new ArgumentException("User name is required.", "user");
            }

            string error;

            if (!UserNameValidator.Validate(user.UserName, out error))
            {
                throw new IdentityException(error);
            }
        }
    }
}