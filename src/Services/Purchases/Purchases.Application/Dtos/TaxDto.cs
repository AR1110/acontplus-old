using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
  public record TaxDto
  {
    public required int TaxId { get; init; }

    public required int TaxPercentId { get; init; }

    public required decimal Percent { get; init; }

    public required decimal TaxBase { get; init; }

    public required decimal TaxValue { get; init; }

    public required decimal Discount { get; init; }
  }
}
