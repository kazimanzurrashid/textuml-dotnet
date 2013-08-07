namespace TextUml.Infrastructure
{
    using System;
    using System.Data.Entity;
    using System.Threading.Tasks;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    using DataAccess;

    [CLSCompliant(false)]
    public class AppUserSecretStore : IUserSecretStore
    {
        private readonly DataContext dataContext;
        private readonly UserSecretStore<UserSecret> store;

        public AppUserSecretStore(DataContext db)
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
                .AnyAsync(t =>
                    t.ActivatedAt != null &&
                    t.User.UserName == userName);

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
}