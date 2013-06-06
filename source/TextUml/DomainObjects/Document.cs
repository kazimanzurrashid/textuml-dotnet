namespace TextUml.DomainObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("tu_Documents")]
    public class Document
    {
        private ICollection<Share> shares;

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }

        public virtual string Title { get; set; }

        public virtual string Content { get; set; }

        public virtual string SharedWithEmails { get; set; }

        public virtual DateTime CreatedAt { get; set; }

        public virtual DateTime UpdatedAt { get; set; }

        public virtual int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<Share> Shares
        {
            get
            {
                return shares ?? (shares = new HashSet<Share>());
            }
        }
    }
}