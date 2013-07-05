namespace TextUml.DomainObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("tu_Documents")]
    public class Document
    {
        private ICollection<Invitation> invitations;
        private ICollection<Share> shares;

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(128)]
        public string Title { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<Invitation> Invitations
        {
            get
            {
                return invitations ??
                    (invitations = new HashSet<Invitation>());
            }
        }

        public virtual ICollection<Share> Shares
        {
            get
            {
                return shares ?? (shares = new HashSet<Share>());
            }
        }
    }
}