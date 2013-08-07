namespace TextUml.Services
{
    using System;
    using System.Web;

    using Microsoft.AspNet.Identity;

    public interface ICurrentUserProvider
    {
        string GetUserId();
    }

    public class CurrentUserProvider : ICurrentUserProvider
    {
        private readonly Func<HttpContextBase> lazyHttpContext;

        public CurrentUserProvider(
            Func<HttpContextBase> lazyHttpContext)
        {
            this.lazyHttpContext = lazyHttpContext;
        }

        public string GetUserId()
        {
            var httpContext = lazyHttpContext();
            var user = httpContext.User.Identity;

            return user.IsAuthenticated ? user.GetUserId() : null;
        }
    }
}