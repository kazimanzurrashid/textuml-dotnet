namespace TextUml.DataAccess
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Validation;
    using System.Threading.Tasks;

    using DomainObjects;

    using Microsoft.AspNet.Identity.EntityFramework;

    [CLSCompliant(false)]
    public interface IDataContext
    {
        DbSet<User> Users { get; }

        DbSet<Token> Tokens { get; }

        DbSet<Document> Documents { get; }

        DbSet<Invitation> Invitations { get; }

        DbSet<Share> Shares { get; }

        Task<int> SaveChangesAsync();
    }

    [CLSCompliant(false)]
    public class DataContext :
        IdentityDbContext<User, UserClaim, UserSecret, UserLogin, Role, UserRole>,
        IDataContext
    {
        public DbSet<Token> Tokens { get; set; }

        public DbSet<Document> Documents { get; set; }

        public DbSet<Invitation> Invitations { get; set; }

        public DbSet<Share> Shares { get; set; }

        protected override DbEntityValidationResult ValidateEntity(
            DbEntityEntry entityEntry,
            IDictionary<object, object> items)
        {
            return new DbEntityValidationResult(entityEntry, new DbValidationError[0]);
        }
    }
}