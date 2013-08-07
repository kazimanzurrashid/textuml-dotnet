namespace TextUml.Infrastructure
{
    using System;
    using System.Threading.Tasks;
    using System.Web;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    [CLSCompliant(false)]
    public class AppIdentityAuthenticationManager : IdentityAuthenticationManager
    {
        private readonly AppIdentityStoreManager storeManager;

        public AppIdentityAuthenticationManager(AppIdentityStoreManager storeManager)
            : base(storeManager)
        {
            this.storeManager = storeManager;
        }

        public async Task<bool> CreateAndSignInExternalUser(
            HttpContextBase context,
            string logOnProvider,
            IUser user, 
            string role,
            bool persist)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            var identity = await GetExternalIdentity(context);

            if (!VerifyExternalIdentity(identity, logOnProvider))
            {
                return false;
            }

            var providerKey = identity.FindFirstValue(
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            if (!(await storeManager.CreateExternalUser(
                user,
                logOnProvider,
                providerKey, 
                role)))
            {
                return false;
            }

            await SignIn(context, user.Id, identity.Claims, persist);

            return true;
        }
    }
}