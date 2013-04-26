namespace TextUml.Infrastructure
{
    using System.Web.Mvc;
    using System.Web.Routing;

    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "user-confirmation",
                "users/confirm/{token}",
                new
                    {
                        controller = "supports",
                        action = "confirmuser"
                    });

            routes.MapRoute(
                "reset-password",
                "passwords/reset/{token}",
                new
                    {
                        controller = "supports",
                        action = "resetpassword"
                    });

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new
                {
                    controller = "home",
                    action = "index",
                    id = UrlParameter.Optional
                });
        }
    }
}