namespace TextUml.Extensions
{
    using System.Web;

    using DomainObjects;

    public static class HttpContextBaseExtensions
    {
        public static bool CanProfile(this HttpContextBase instance)
        {
            if (instance == null)
            {
                return false;
            }

            if (instance.Request.IsLocal)
            {
                return true;
            }

            var user = instance.User;
            var result = (user != null) &&
                user.Identity.IsAuthenticated &&
                user.IsInRole(UserRoles.Administrator);

            return result;
        }
    }
}