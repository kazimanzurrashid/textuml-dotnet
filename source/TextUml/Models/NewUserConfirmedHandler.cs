namespace TextUml.Models
{
    using System.Linq;

    using DataAccess;
    using DomainObjects;

    public interface INewUserConfirmedHandler
    {
        void Handle(string email);
    }

    public class NewUserConfirmedHandler : INewUserConfirmedHandler
    {
        private readonly IDataContext dataContext;

        public NewUserConfirmedHandler(IDataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public void Handle(string email)
        {
            var user = dataContext.Users.First(u => u.Email == email);

            var invitations = dataContext.Invitations
                .Where(i => i.Email == user.Email)
                .Select(i => new { i.DocumentId, i.CanEdit })
                .ToList();

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

            dataContext.SaveChanges();
        }
    }
}