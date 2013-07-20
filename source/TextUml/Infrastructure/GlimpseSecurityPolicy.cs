namespace TextUml.Infrastructure
{
    using System;

    using Glimpse.AspNet.Extensions;
    using Glimpse.Core.Extensibility;

    using DomainObjects;

    [CLSCompliant(false)]
    public class GlimpseSecurityPolicy : IRuntimePolicy
    {
        public RuntimeEvent ExecuteOn
        {
            get { return RuntimeEvent.EndRequest; }
        }

        public RuntimePolicy Execute(IRuntimePolicyContext policyContext)
        {
            if (policyContext == null)
            {
                return RuntimePolicy.Off;
            }

            var httpContext = policyContext.GetHttpContext();

            if (httpContext.Request.IsLocal)
            {
                return RuntimePolicy.On;
            }

            var user = httpContext.User;

            return (user != null) &&
                user.Identity.IsAuthenticated &&
                user.IsInRole(User.Roles.Administrator) ?
                RuntimePolicy.On :
                RuntimePolicy.Off;
        }
    }
}