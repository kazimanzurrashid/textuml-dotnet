namespace TextUml.Services
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    using DataAccess;
    using DomainObjects;
    using Models;

    public interface IShareService
    {
        Task<IEnumerable<ShareRead>> Query(int documentId);

        Task Update(
            int documentId,
            IEnumerable<ShareEdit> models,
            Action notFound);

        Task<bool> CanView(int documentId);

        Task<bool> CanEdit(int documentId);
    }

    public class ShareService : IShareService
    {
        private readonly IDataContext dataContext;
        private readonly ICurrentUserProvider currentUserProvider;

        public ShareService(
            IDataContext dataContext,
            ICurrentUserProvider currentUserProvider)
        {
            this.dataContext = dataContext;
            this.currentUserProvider = currentUserProvider;
        }

        public async Task<IEnumerable<ShareRead>> Query(int documentId)
        {
            var result = await dataContext.Invitations
                .Where(i =>
                    i.DocumentId == documentId &&
                    i.Document.UserId == currentUserProvider.UserId)
                .Select(i => new ShareRead
                                 {
                                     Id = i.Id,
                                     Email = i.Email,
                                     CanEdit = i.CanEdit
                                 })
                .OrderBy(i => i.Email)
                .ToListAsync();

            return result;
        } 

        public async Task Update(
            int documentId,
            IEnumerable<ShareEdit> models,
            Action notFound)
        {
            if (models == null)
            {
                throw new ArgumentNullException("models");
            }

            if (notFound == null)
            {
                throw new ArgumentNullException("notFound");
            }

            var document = await dataContext.Documents
                .FirstOrDefaultAsync(d =>
                    d.Id == documentId &&
                    d.UserId == currentUserProvider.UserId);

            if (document == null)
            {
                notFound();
                return;
            }

            var newInvitations = models.ToList();
            var invitationEmails = newInvitations.Select(m => m.Email)
                .ToList();

            var allInvitations = await UpdateInvitations(
                documentId,
                invitationEmails,
                newInvitations);

            await UpdateShares(documentId, invitationEmails, allInvitations);

            await dataContext.SaveChangesAsync();
        }

        public async Task<bool> CanView(int documentId)
        {
            var userId = currentUserProvider.UserId;

            var result = await dataContext.Shares.AnyAsync(s =>
                (s.DocumentId == documentId &&
                s.Document.UserId == userId) ||
                (s.DocumentId == documentId &&
                s.UserId == userId));

            return result;
        }

        public async Task<bool> CanEdit(int documentId)
        {
            var userId = currentUserProvider.UserId;

            var result = await dataContext.Shares.AnyAsync(s =>
                (s.DocumentId == documentId &&
                s.Document.UserId == userId) ||
                (s.DocumentId == documentId &&
                s.UserId == userId &&
                s.CanEdit));

            return result;
        }

        private async Task<IEnumerable<Invitation>> UpdateInvitations(
            int documentId,
            IEnumerable<string> invitationEmails,
            IEnumerable<ShareEdit> newInvitations)
        {
            var existingInvitations = await dataContext.Invitations
                .Where(i => i.DocumentId == documentId)
                .ToListAsync();

            var invitationsToDelete = existingInvitations.Where(ei =>
                    !invitationEmails.Contains(
                        ei.Email,
                        StringComparer.OrdinalIgnoreCase));

            foreach (var invitation in invitationsToDelete)
            {
                dataContext.Invitations.Remove(invitation);
            }

            var allInvitations = new List<Invitation>();

            foreach (var model in newInvitations)
            {
                var invitation = existingInvitations
                    .FirstOrDefault(i =>
                        i.Email.Equals(
                            model.Email,
                            StringComparison.OrdinalIgnoreCase));

                if (invitation == null)
                {
                    invitation = new Invitation
                                     {
                                         Email = model.Email,
                                         DocumentId = documentId
                                     };
                    dataContext.Invitations.Add(invitation);
                }

                invitation.CanEdit = model.CanEdit;
                allInvitations.Add(invitation);
            }

            return allInvitations;
        }

        private async Task UpdateShares(
            int documentId,
            IEnumerable<string> invitationEmails,
            IEnumerable<Invitation> allInvitations)
        {
            var existingShares = await dataContext.Shares
                .Where(s => s.DocumentId == documentId)
                .Select(s => new { share = s, userEmail = s.User.Email })
                .ToListAsync();

            var sharesToDelete = existingShares.Where(es => 
                !invitationEmails.Contains(
                    es.userEmail,
                    StringComparer.OrdinalIgnoreCase));

            foreach (var es in sharesToDelete)
            {
                dataContext.Shares.Remove(es.share);
            }

            foreach (var invitation in allInvitations)
            {
                var share = existingShares
                    .Where(es => 
                        invitation.Email.Equals(
                            es.userEmail,
                            StringComparison.OrdinalIgnoreCase))
                    .Select(es => es.share)
                    .FirstOrDefault();

                if (share == null)
                {
                    var invitationEmail = invitation.Email;

                    var user = await dataContext.Users
                        .FirstOrDefaultAsync(u => u.Email == invitationEmail);

                    if (user == null)
                    {
                        continue;
                    }

                    share = new Share
                    {
                        DocumentId = documentId,
                        UserId = user.Id
                    };

                    dataContext.Shares.Add(share);
                }

                share.CanEdit = invitation.CanEdit;
            }
        }
    }
}