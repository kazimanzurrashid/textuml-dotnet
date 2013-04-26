namespace TextUml.DomainObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Users")]
    public class User
    {
        private ICollection<Document> documents;

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

        public static class Roles
        {
            public const string Administrator = "administrator";
            public const string User = "user";

            public static readonly IEnumerable<string> All = new[] { Administrator, User };
        }
    }
}