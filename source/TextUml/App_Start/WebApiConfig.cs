namespace TextUml.Infrastructure
{
    using System;
    using System.Web.Http;

    using Newtonsoft.Json.Serialization;

    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            if (config == null)
            {
                throw new ArgumentNullException("config");
            }

            config.Formatters
                .JsonFormatter
                .SerializerSettings
                .ContractResolver = new CamelCasePropertyNamesContractResolver();

            config.Routes.MapHttpRoute(
                "PasswordsRpcApi",
                "api/passwords/{action}",
                new { controller = "passwords" });

            config.Routes.MapHttpRoute(
                "SharesApi",
                "api/documents/{id}/shares",
                new { controller = "shares" });

            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional });
        }
    }
}