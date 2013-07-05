namespace TextUml.Models
{
    using System.ComponentModel.DataAnnotations;

    public class DocumentEdit
    {
        [Required]
        public string Title { get; set; }

        public string Content { get; set; }
    }
}