namespace TextUml.Infrastructure
{
    using System;

    using Microsoft.AspNet.Identity.EntityFramework;

    using DataAccess;

    [CLSCompliant(false)]
    public class AppIdentityStoreContext : IdentityStoreContext
    {
        public AppIdentityStoreContext(DataContext dataContext) :
            base(dataContext)
        {
            Secrets = new AppUserSecretStore(dataContext);
        }
    }
}