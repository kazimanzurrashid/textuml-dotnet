namespace TextUml.DomainObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("tu_Users")]
    public class User
    {
        private ICollection<Document> documents;
        private ICollection<Share> shares;

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }

        public virtual string Email { get; set; }

        public virtual ICollection<Document> Documents
        {
            get
            {
                return documents ?? (documents = new HashSet<Document>());
            }
        }

        public virtual ICollection<Share> Shares
        {
            get
            {
                return shares ?? (shares = new HashSet<Share>());
            }
        }

        public static class Roles
        {
            public const string Administrator = "administrator";
            public const string User = "user";

            public static readonly IEnumerable<string> All = new[] { Administrator, User };
        }
    }
}