namespace TextUml
{
    using System.Linq;
    using System.Web.Mvc;

    using DomainObjects;
    using Properties;
    using Services;

    public static class MembershipConfig
    {
        public static void Register()
        {
            CreateDefaults();
        }

        private static void CreateDefaults()
        {
            var membership = DependencyResolver.Current
                .GetService<IMembershipService>();

            CreateRoles(membership);

            CreateUser(
                membership,
                Settings.Default.DefaultAdminUserName, 
                Settings.Default.DefaultAdminUserPassword,
                UserRoles.Administrator);

            CreateUser(
                membership,
                Settings.Default.DefaultDemoUserName, 
                Settings.Default.DefaultDemoUserPassword,
                UserRoles.User);
        }

        private static void CreateRoles(IMembershipService membership)
        {
            membership.CreateRoles(UserRoles.All.ToArray()).Wait();
        }

        private static void CreateUser(
            IMembershipService membership, 
            string email, 
            string password,
            string role)
        {
            if (membership.InternalUserExists(email).Result)
            {
                return;
            }

            membership.InternalSignup(email, password, role, false).Wait();
        }
    }
}