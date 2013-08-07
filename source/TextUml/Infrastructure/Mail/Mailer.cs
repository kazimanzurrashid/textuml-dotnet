namespace TextUml.Infrastructure
{
    using System.Threading.Tasks;

    using Postal;

    public interface IMailer
    {
        Task UserConfirmationAsync(string recipient, string token);

        Task ForgotPasswordAsync(string recipient, string token);
    }

    public class Mailer : IMailer
    {
        private readonly string sender;
        private readonly IMailUrlResolver urlResolver;
        private readonly IEmailService emailService;

        public Mailer(
            string sender,
            IMailUrlResolver urlResolver,
            IEmailService emailService)
        {
            this.sender = sender;
            this.urlResolver = urlResolver;
            this.emailService = emailService;
        }

        public Task UserConfirmationAsync(string recipient, string token)
        {
            dynamic email = new Email("UserConfirmation");
            email.To = recipient;
            email.From = sender;
            email.Url = urlResolver.UserConfirmation(token);

            return emailService.SendAsync(email);
        }

        public Task ForgotPasswordAsync(string recipient, string token)
        {
            dynamic email = new Email("ForgotPassword");
            email.To = recipient;
            email.From = sender;
            email.Url = urlResolver.ForgotPassword(token);

            return emailService.SendAsync(email);
        }
    }
}