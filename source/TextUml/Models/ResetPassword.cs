namespace TextUml.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ResetPassword
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [StringLength(64, MinimumLength = 6)]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}