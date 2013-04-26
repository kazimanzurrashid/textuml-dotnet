namespace TextUml.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Runtime.Serialization.Formatters.Binary;
    using System.Web;
    using System.Web.Mvc;

    public class CookieTempDataProvider : ITempDataProvider
    {
        private const string TempDataCookieKey = "__ControllerTempData";

        public IDictionary<string, object> LoadTempData(
            ControllerContext controllerContext)
        {
            var httpContext = controllerContext.HttpContext;
            var cookie = httpContext.Request.Cookies[TempDataCookieKey];

            if (cookie != null &&
                !string.IsNullOrWhiteSpace(cookie.Value))
            {
                var data = Deserialize(cookie.Value);

                ExpireCookie(httpContext.Response);

                return data;
            }

            return new Dictionary<string, object>();
        }

        public void SaveTempData(
            ControllerContext controllerContext,
            IDictionary<string, object> data)
        {
            var httpContext = controllerContext.HttpContext;

            if (data.Count == 0)
            {
                ExpireCookie(httpContext.Response);
                return;
            }

            var payload = Serialize(data);

            var cookie = new HttpCookie(TempDataCookieKey)
                {
                    HttpOnly = true,
                    Value = payload
                };

            httpContext.Response.Cookies.Add(cookie);
        }

        private static void ExpireCookie(HttpResponseBase httpResponse)
        {
            if (httpResponse.Cookies == null)
            {
                return;
            }

            var cookie = httpResponse.Cookies[TempDataCookieKey];

            if (cookie == null)
            {
                return;
            }

            cookie.Value = null;
            cookie.Expires = DateTime.MinValue;
        }

        private static IDictionary<string, object> Deserialize(string payload)
        {
            var bytes = Convert.FromBase64String(payload);

            using (var stream = new MemoryStream(bytes))
            {
                return new BinaryFormatter().Deserialize(stream, null)
                    as IDictionary<string, object>;
            }
        }

        private static string Serialize(IDictionary<string, object> values)
        {
            using (var stream = new MemoryStream())
            {
                new BinaryFormatter().Serialize(stream, values);
                stream.Flush();
                return Convert.ToBase64String(stream.ToArray());
            }
        }
    }
}