namespace TextUml.Infrastructure
{
    using System;
    using System.Configuration;
    using System.Reflection;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;

    using Microsoft.AspNet.SignalR;
    using WebMatrix.WebData;

    using Autofac;
    using Autofac.Builder;
    using Autofac.Integration.Mvc;
    using Autofac.Integration.WebApi;

    using Postal;

    using DataAccess;
    using Hubs;
    using Properties;
    using Services;

    public static class ContainerConfig
    {
        public static void Register()
        {
            var assemblies = new[] { Assembly.GetExecutingAssembly() };

            RegisterMvc(assemblies);
            RegisterWebApi(assemblies, GlobalConfiguration.Configuration);
            RegisterSignalr();
        }

        private static void RegisterMvc(Assembly[] assemblies)
        {
            var builder = CreateContainerBuilder();

            builder.RegisterControllers(assemblies);
            builder.RegisterModelBinders(assemblies);
            builder.RegisterModelBinderProvider();
            builder.RegisterFilterProvider();

            Register<CookieTempDataProvider>(builder);

            var container = builder.Build();
            var resolver = new AutofacDependencyResolver(container);

            DependencyResolver.SetResolver(resolver);
        }

        private static void RegisterWebApi(
            Assembly[] assemblies,
            HttpConfiguration configuration)
        {
            var builder = CreateContainerBuilder();

            builder.RegisterWebApiFilterProvider(configuration);
            builder.RegisterWebApiModelBinders(assemblies);
            builder.RegisterApiControllers(assemblies);

            var container = builder.Build();

            configuration.DependencyResolver =
                new AutofacWebApiDependencyResolver(container);
        }

        private static void RegisterSignalr()
        {
            var builder = CreateContainerBuilder();
            var container = builder.Build();

            GlobalHost.DependencyResolver
                .Register(
                    typeof(SharingHub),
                    () => new SharingHub(container.Resolve<IShareService>()));
        }

        private static ContainerBuilder CreateContainerBuilder()
        {
            var builder = new ContainerBuilder();

            var settings = ConfigurationManager.AppSettings;

            Register<UrlSafeSecureDataSerializer>(builder)
                .WithParameter(
                    "algorithm",
                    settings["urlSafeSecureData.algorithm"])
                .WithParameter("key", settings["urlSafeSecureData.key"])
                .WithParameter("vector", settings["urlSafeSecureData.vector"])
                .SingleInstance();

            builder.Register(c => new HttpContextWrapper(HttpContext.Current))
                .As<HttpContextBase>();

            Register<EmailService>(builder);
            Register<MailUrlResolver>(builder);

            Register<Mailer>(builder)
                .WithParameter("sender", Settings.Default.SupportEmailAddress);

            Register<CurrentUserProvider>(builder)
                .WithParameter(
                    "getId",
                    new Func<int>(() => WebSecurity.CurrentUserId));

            Register<MembershipService>(builder);
            Register<DocumentService>(builder);
            Register<ShareService>(builder);
            Register<NewUserConfirmedHandler>(builder);
            Register<DataContext>(builder);

            return builder;
        }

        private static IRegistrationBuilder<TService,
            ConcreteReflectionActivatorData,
            SingleRegistrationStyle>
            Register<TService>(ContainerBuilder builder)
        {
            return builder.RegisterType<TService>()
                .AsImplementedInterfaces();
        }
    }
}