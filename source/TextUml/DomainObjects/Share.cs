namespace TextUml.DomainObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    using Microsoft.AspNet.Identity.EntityFramework;

    [Table("Shares"), CLSCompliant(false)]
    public class Share
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int DocumentId { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public bool CanEdit { get; set; }
    }
}