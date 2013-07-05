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
        public int Id { get; set; }

        [Required, StringLength(128)]
        public string Email { get; set; }

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

            private static readonly string[] List = new[]
            {
                Administrator,
                User
            };

            public static IEnumerable<string> All
            {
                get { return List; }
            }
        }
    }
}