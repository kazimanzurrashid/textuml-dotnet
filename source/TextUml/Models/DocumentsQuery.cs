namespace TextUml.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Globalization;
    using System.Linq;

    public class DocumentsQuery : IValidatableObject
    {
        private static readonly IEnumerable<string> SortOrders
            = new[] { "asc", "desc" };

        private static readonly IEnumerable<string> SortProperties =
            new[] { "id", "title", "updatedAt", "createdAt" };

        public DocumentsQuery()
        {
            Top = 25;
        }

        public string Filter { get; set; }

        public int Top { get; set; }

        public int Skip { get; set; }

        public string OrderBy { get; set; }

        public string GetOrderByClause()
        {
            return OrderBy ?? "updatedAt desc ";
        }

        public IEnumerable<ValidationResult> Validate(
            ValidationContext validationContext)
        {
            if (Top < 0)
            {
                yield return new ValidationResult(
                    "Top must be positive integer.");
            }

            if (Skip < 0)
            {
                yield return new ValidationResult(
                    "Skip cannot be negative.");
            }

            if (string.IsNullOrWhiteSpace(OrderBy))
            {
                yield break;
            }

            var orderByPairs = OrderBy.Split(
                new[] { ' ' },
                StringSplitOptions.RemoveEmptyEntries);

            if (!SortProperties.Contains(
                orderByPairs[0],
                StringComparer.OrdinalIgnoreCase))
            {
                var sortColumnErrorMessage = string.Format(
                    CultureInfo.CurrentCulture,
                    "Invalid sort property, only supports {0}.",
                    string.Join(", ", SortProperties));

                yield return new ValidationResult(sortColumnErrorMessage);
            }

            if (orderByPairs.Length < 2 ||
                SortOrders.Contains(
                    orderByPairs[1],
                    StringComparer.OrdinalIgnoreCase))
            {
                yield break;
            }

            var sortOrderErrorMessage = string.Format(
                CultureInfo.CurrentCulture,
                "Invalid sort order, only supports {0}.",
                string.Join(", ", SortOrders));

            yield return new ValidationResult(sortOrderErrorMessage);
        }
    }
}