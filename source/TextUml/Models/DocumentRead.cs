namespace TextUml.Models
{
    using System;

    public class DocumentRead : DocumentEdit
    {
        public int Id { get; set; }

        public bool Owned { get; set; }

        public bool Editable { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}