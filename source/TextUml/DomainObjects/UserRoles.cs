namespace TextUml.DomainObjects
{
    using System.Collections.Generic;

    public static class UserRoles
    {
        public const string Administrator = "administrator";
        public const string User = "user";

        public static IEnumerable<string> All
        {
            get
            {
                return new[] { Administrator, User };
            }
        }
    }
}