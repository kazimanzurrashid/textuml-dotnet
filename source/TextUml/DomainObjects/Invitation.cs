namespace TextUml.DomainObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Invitations"), CLSCompliant(false)]
    public class Invitation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(256)]
        public string Email { get; set; }

        public int DocumentId { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }

        public bool CanEdit { get; set; }
    }
}