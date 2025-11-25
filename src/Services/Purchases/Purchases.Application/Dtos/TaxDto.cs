using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.DTOs
{
    public record TaxDto
    {
        [Required]
        public int TaxId { get; init; }

        [Required]
        public int TaxPercentId { get; init; }

        [Required]

        public decimal Percent { get; init; }

        [Required]

        public decimal TaxBase { get; init; }

        [Required]

        public decimal TaxValue { get; init; }

        [Required]

        public decimal Discount { get; init; }
    }
}