namespace TextUml.DomainObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Security.Cryptography;
    using System.Web;

    using Microsoft.AspNet.Identity.EntityFramework;

    using Infrastructure;

    [Table("Tokens"), CLSCompliant(false)]
    public class Token
    {
        private static readonly TimeSpan ResetPasswordExpireTimeframe =
            TimeSpan.FromDays(1);

        [Obsolete("Used by the underlying ORM.")]
        public Token()
        {
        }

        public Token(string userId, bool requiresActivation)
        {
            UserId = userId;

            if (requiresActivation)
            {
                ActivationToken = GenerateToken();
            }
            else
            {
                MarkActivated();
            }
        }

        [Key]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public DateTime? ActivatedAt { get; set; }

        [StringLength(128)]
        public string ActivationToken { get; set; }

        [StringLength(128)]
        public string ResetPasswordToken { get; set; }

        public DateTime? ResetPasswordTokenExpiredAt { get; set; }

        public bool HasResetPasswordTokenExpired
        {
            get
            {
                return ResetPasswordTokenExpiredAt > Clock.UtcNow();
            }
        }

        public bool CanActivate(string token)
        {
            return ActivatedAt == null &&
                string.Equals(
                    ActivationToken,
                    token,
                    StringComparison.OrdinalIgnoreCase);
        }

        public void MarkActivated()
        {
            if (ActivatedAt != null)
            {
                return;
            }

            ActivatedAt = Clock.UtcNow();
        }

        public void GenerateResetPasswordToken()
        {
            ResetPasswordToken = GenerateToken();
            ResetPasswordTokenExpiredAt = Clock.UtcNow()
                .Add(ResetPasswordExpireTimeframe);
        }

        public void ExpireResetPasswordToken()
        {
            ResetPasswordTokenExpiredAt = Clock.UtcNow();
        }

        private static string GenerateToken()
        {
            var buffer = new byte[16];

            using (var crypto = new RNGCryptoServiceProvider())
            {
                crypto.GetBytes(buffer);
            }

            return HttpServerUtility.UrlTokenEncode(buffer);
        }
    }
}