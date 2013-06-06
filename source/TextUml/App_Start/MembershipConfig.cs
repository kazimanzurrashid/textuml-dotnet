namespace TextUml.Infrastructure
{
    using System.Linq;
    using System.Web.Security;

    using WebMatrix.WebData;

    using DomainObjects;
    using Properties;

    public class MembershipConfig
    {
        public static void Register()
        {
            Configure();
            CreateDefaults();
        }

        private static void Configure()
        {
            WebSecurity.InitializeDatabaseConnection(
                "DefaultConnection",
                "tu_Users",
                "Id",
                "Email",
                true);
        }

        private static void CreateDefaults()
        {
            CreateRoles();

            CreateUser(
                Settings.Default.DefaultAdminUserName,
                Settings.Default.DefaultAdminUserPassword,
                User.Roles.Administrator);

            CreateUser(
                Settings.Default.DefaultDemoUserName,
                Settings.Default.DefaultDemoUserPassword,
                User.Roles.User);
        }

        private static void CreateRoles()
        {
            foreach (var role in User.Roles
                .All.Where(role => !Roles.RoleExists(role)))
            {
                Roles.CreateRole(role);
            }
        }

        private static void CreateUser(
            string userName,
            string password,
            string role)
        {
            if (!WebSecurity.UserExists(userName))
            {
                WebSecurity.CreateUserAndAccount(userName, password);
            }

            if (!Roles.IsUserInRole(userName, role))
            {
                Roles.AddUserToRole(userName, role);
            }
        }
    }
}