namespace Purchases.Application.Dtos
{
  public record ReceiptDetailDto : PurchaseDetailBaseDto
  {
    public required int OrderIndex { get; set; }
    public int? PurchaseOrderDetailId { get; set; }
  }
}
