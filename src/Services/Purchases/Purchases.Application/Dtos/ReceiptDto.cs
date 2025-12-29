namespace Purchases.Application.Dtos
{
  public record ReceiptDto : BaseDto
  {
    public int? EmissionPointId { get; set; }


    public required decimal SubtotalExcludingTaxes { get; set; }


    public required decimal TotalDiscount { get; set; }


    public required decimal Tip { get; set; }


    public required decimal Surcharge { get; set; }


    public required decimal Freight { get; set; }


    public required decimal Total { get; set; }
  }
}
