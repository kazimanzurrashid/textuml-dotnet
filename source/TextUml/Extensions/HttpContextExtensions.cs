namespace TextUml.Extensions
{
    using System;
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
            if (instance == null)
            {
                throw new ArgumentNullException("instance");
            }

            if (instance.Request.IsLocal)
            {
                return true;
            }

            var user = instance.User;

            return user.Identity.IsAuthenticated &&
                user.IsInRole(User.Roles.Administrator);
        }
    }
}