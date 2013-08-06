namespace TextUml.DomainObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    using Microsoft.AspNet.Identity.EntityFramework;

    [Table("Tokens"), CLSCompliant(false)]
    public class Token
    {
        [Key]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public DateTime? ActivatedAt { get; set; }

        [StringLength(128)]
        public string ActivationToken { get; set; }

        [StringLength(128)]
        public string ResetPasswordToken { get; set; }

        public DateTime? ResetPasswordTokenExpiredAt { get; set; }
    }
}