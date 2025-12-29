namespace Purchases.Application.Dtos
{
    public record ReceiptDetailDto : DetailBaseDto
    {
        public required int OrderIndex { get; set; }
        public int? PurchaseOrderDetailId { get; set; }
    }
}
