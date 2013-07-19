namespace TextUml.Services
{
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    using DataAccess;
    using DomainObjects;

    public interface INewUserConfirmedHandler
    {
        Task Handle(string email);
    }

    public class NewUserConfirmedHandler : INewUserConfirmedHandler
    {
        private readonly IDataContext dataContext;

        public NewUserConfirmedHandler(IDataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task Handle(string email)
        {
            var user = await dataContext.Users.FirstAsync(u => u.Email == email);

            var invitations = await dataContext.Invitations
                .Where(i => i.Email == user.Email)
                .Select(i => new { i.DocumentId, i.CanEdit })
                .ToListAsync();

            foreach (var share in invitations
                .Select(invitation =>
                    new Share
                    {
                        UserId = user.Id,
                        DocumentId = invitation.DocumentId,
                        CanEdit = invitation.CanEdit
                    }))
            {
                dataContext.Shares.Add(share);
            }

            await dataContext.SaveChangesAsync();
        }
    }
}