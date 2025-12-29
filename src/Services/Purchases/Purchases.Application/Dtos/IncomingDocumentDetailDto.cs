namespace Purchases.Application.Dtos
{
  public record IncomingDocumentDetailDto : DetailBaseDto
  {
    public required int OrderIndex { get; set; }

    public int? IncomingDocumentDetailId { get; set; }

    public required bool TracksInventory { get; set; }


    public required decimal TransactionQuantity { get; set; }


    public required decimal ConversionRate { get; set; }


    public required decimal CostPrice { get; set; }


    public required decimal FractionalCostPrice { get; set; }

    // * Para otras clases con mínimas diferencias
    public int? PurchaseSettlementDetailId { get; set; }
    public required int? PurchaseInvoiceDetailId { get; set; }
  }
}
