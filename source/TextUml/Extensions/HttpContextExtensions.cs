namespace TextUml.Extensions
{
    using System.Web;

    using DomainObjects;

    public static class HttpContextExtensions
    {
        public static bool CanProfile(this HttpContext instance)
        {
            return new HttpContextWrapper(instance).CanProfile();
        }

        public static bool CanProfile(this HttpContextBase instance)
        {
            if (instance.Request.IsLocal)
            {
                return true;
            }

            var user = instance.User;

            if (user == null)
            {
                return false;
            }

            return user.Identity.IsAuthenticated &&
                user.IsInRole(User.Roles.Administrator);
        }
    }
}