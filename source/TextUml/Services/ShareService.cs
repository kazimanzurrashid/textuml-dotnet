namespace TextUml.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using DataAccess;
    using Models;

    using TextUml.DomainObjects;

    public interface IShareService
    {
        IEnumerable<ShareRead> Query(int documentId);

        void Update(int documentId, IEnumerable<ShareEdit> models, Action notFound);
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

        public IEnumerable<ShareRead> Query(int documentId)
        {
            return dataContext.Invitations
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
                .ToList();
        } 

        public void Update(
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

            var document = dataContext.Documents
                .FirstOrDefault(d =>
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

            var allInvitations = UpdateInvitations(
                documentId,
                invitationEmails,
                newInvitations);

            UpdateShares(documentId, invitationEmails, allInvitations);

            dataContext.SaveChanges();
        }

        private IEnumerable<Invitation> UpdateInvitations(
            int documentId,
            IEnumerable<string> invitationEmails,
            IEnumerable<ShareEdit> newInvitations)
        {
            var existingInvitations = dataContext.Invitations
                .Where(i => i.DocumentId == documentId)
                .ToList();

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

        private void UpdateShares(
            int documentId,
            IEnumerable<string> invitationEmails,
            IEnumerable<Invitation> allInvitations)
        {
            var existingShares = dataContext.Shares
                .Where(s => s.DocumentId == documentId)
                .Select(s => new { share = s, userEmail = s.User.Email })
                .ToList();

            var sharesToDelete = existingShares.Where(es => 
                !invitationEmails.Contains(
                    es.userEmail,
                    StringComparer.OrdinalIgnoreCase));

            foreach (var es in sharesToDelete)
            {
                dataContext.Shares.Remove(es.share);
            }

            foreach (var invation in allInvitations)
            {
                var share = existingShares
                    .Where(es => 
                        invation.Email.Equals(
                            es.userEmail,
                            StringComparison.OrdinalIgnoreCase))
                    .Select(es => es.share)
                    .FirstOrDefault();

                if (share == null)
                {
                    var user = dataContext.Users
                        .FirstOrDefault(u => u.Email == invation.Email);

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

                share.CanEdit = invation.CanEdit;
            }
        }
    }
}