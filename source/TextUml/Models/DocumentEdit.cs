namespace TextUml.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    [Serializable]
    public class DocumentEdit
    {
        [Required]
        public string Title { get; set; }

        public string Content { get; set; }
    }
}