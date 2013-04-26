namespace TextUml.Infrastructure
{
    using System;
    using System.Configuration;
    using System.Reflection;
    using System.Threading;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Security;

    using WebMatrix.WebData;

    using Autofac;
    using Autofac.Builder;
    using Autofac.Integration.Mvc;
    using Autofac.Integration.WebApi;

    using Postal;

    using Controllers;
    using DataAccess;

    using Models;
    using Properties;

    using UserRoles = DomainObjects.User.Roles;

    public class ContainerConfig
    {
        public static void Register()
        {
            var assemblies = new[] { Assembly.GetExecutingAssembly() };

            RegisterUi(assemblies);
            RegisterApi(assemblies, GlobalConfiguration.Configuration);
        }

        private static void RegisterUi(Assembly[] assemblies)
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(assemblies);
            builder.RegisterModelBinders(assemblies);
            builder.RegisterModelBinderProvider();
            builder.RegisterFilterProvider();

            RegisterMailer(builder);

            Register<DataContext>(builder).InstancePerHttpRequest();
            RegisterDocumentService(builder);
            RegisterUrlSafeSecureDataSerializer(builder);

            Register<CookieTempDataProvider>(builder);

            builder.RegisterType<SupportsController>()
                .WithParameter(
                    "confirmUser",
                    new Func<string, string, bool>(WebSecurity.ConfirmAccount))
                .WithParameter(
                    "resetPassword",
                    new Func<string, string, bool>(WebSecurity.ResetPassword));

            var container = builder.Build();
            var resolver = new AutofacDependencyResolver(container);

            DependencyResolver.SetResolver(resolver);
        }

        private static void RegisterApi(
            Assembly[] assemblies,
            HttpConfiguration configuration)
        {
            var builder = new ContainerBuilder();

            builder.RegisterWebApiFilterProvider(configuration);
            builder.RegisterWebApiModelBinders(assemblies);
            builder.RegisterApiControllers(assemblies);

            RegisterMailer(builder);

            Register<DataContext>(builder).InstancePerApiRequest();
            RegisterDocumentService(builder);
            RegisterUrlSafeSecureDataSerializer(builder);

            builder.RegisterType<SessionsController>()
                .WithParameter(
                    "signIn",
                    new Func<string, string, bool, bool>(WebSecurity.Login))
                .WithParameter("signOut", new Action(WebSecurity.Logout));

            Func<string, string, bool, string> signUp = (userName, password, requireConfirmation) =>
            {
                var token = WebSecurity.CreateUserAndAccount(
                    userName,
                    password,
                    requireConfirmationToken: requireConfirmation);

                Roles.AddUserToRole(userName, UserRoles.User);

                return token;
            };

            builder.RegisterType<UsersController>()
                .WithParameter(
                    "signup",
                    new Func<string, string, bool, string>(signUp));

            Func<string, string> forgotPassword = userName =>
            {
                try
                {
                    return WebSecurity.GeneratePasswordResetToken(userName);
                }
                catch (InvalidOperationException)
                {
                    // Throws when user does not exists,
                    // and we do not want to disclose user's email.
                }

                return null;
            };

            builder.RegisterType<PasswordsController>()
                .WithParameter(
                    "forgotPassword",
                    new Func<string, string>(forgotPassword))
                .WithParameter(
                    "changePassword",
                    new Func<string, string, string, bool>(
                        WebSecurity.ChangePassword));

            var container = builder.Build();

            configuration.DependencyResolver =
                new AutofacWebApiDependencyResolver(container);
        }

        private static void RegisterMailer(ContainerBuilder builder)
        {
            builder.Register(c => new HttpContextWrapper(HttpContext.Current))
                .As<HttpContextBase>();

            Register<EmailService>(builder);
            Register<MailUrlResolver>(builder);

            Register<Mailer>(builder)
                .WithParameter("sender", Settings.Default.SupportEmailAddress);
        }

        private static void RegisterDocumentService(ContainerBuilder builder)
        {
            Register<DocumentService>(builder)
                .WithParameter(
                    "getUserId",
                    new Func<int>(() =>
                    {
                        var user = Thread.CurrentPrincipal.Identity;
                        return user.IsAuthenticated ? WebSecurity.GetUserId(user.Name) : 0;
                    }));
        }

        private static void RegisterUrlSafeSecureDataSerializer(ContainerBuilder builder)
        {
            var settings = ConfigurationManager.AppSettings;

            Register<UrlSafeSecureDataSerializer>(builder)
                .WithParameter("algorithm", settings["urlSafeSecureData.algorithm"])
                .WithParameter("key", settings["urlSafeSecureData.key"])
                .WithParameter("vector", settings["urlSafeSecureData.vector"]);
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