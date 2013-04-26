namespace TextUml.Extensions
{
    using System;
    using System.Web.Mvc;

    public static class UrlHelperExtensions
    {
        private static string clientLinkPrefix = "#!/";

        public static string ClientUrlPrefix
        {
            get { return clientLinkPrefix; }

            set { clientLinkPrefix = value; }
        }

        public static string ApiUrlPrefix(this UrlHelper instance)
        {
            var root = instance.Content("~/api");

            if (root.EndsWith("/", StringComparison.Ordinal))
            {
                root = root.Substring(0, root.Length - 1);
            }

            return root;
        }

        public static string ClientUrl(
            this UrlHelper instance,
            params string[] paths)
        {
            var url = ClientUrlPrefix;

            var relativePath = string.Join("/", paths);

            if (relativePath.StartsWith("/", StringComparison.Ordinal) &&
                relativePath.Length > 0)
            {
                relativePath = relativePath.Substring(1);
            }

            if (relativePath.EndsWith("/", StringComparison.Ordinal) &&
                relativePath.Length > 0)
            {
                relativePath = relativePath.Substring(
                    0, relativePath.Length - 1);
            }

            url += relativePath;

            return url;
        }
    }
}