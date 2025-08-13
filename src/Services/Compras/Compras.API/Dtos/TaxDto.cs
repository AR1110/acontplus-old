using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record TaxDto
  {
    [Required]
    public int TaxId { get; init; }

    [Required]
    public int TaxPercentId { get; init; }

    [Required]
    [Precision(18, 5)]
    public decimal Percent { get; init; }

    [Required]
    [Precision(18, 5)]
    public decimal TaxBase { get; init; }

    [Required]
    [Precision(18, 5)]
    public decimal TaxValue { get; init; }

    [Required]
    [Precision(18, 5)]
    public decimal Discount { get; init; }
  }
}