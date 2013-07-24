namespace TextUml.Infrastructure
{
    using System;

    using Glimpse.Core.Extensibility;
    using Glimpse.AspNet.Extensions;

    using Extensions;

    [CLSCompliant(false)]
    public class GlimpseSecurityPolicy : IRuntimePolicy
    {
        public RuntimeEvent ExecuteOn
        {
            get { return RuntimeEvent.EndRequest; }
        }

        public RuntimePolicy Execute(IRuntimePolicyContext policyContext)
        {
            return (policyContext != null) &&
                policyContext.GetHttpContext().CanProfile() ?
                RuntimePolicy.On :
                RuntimePolicy.Off;
        }
    }
}