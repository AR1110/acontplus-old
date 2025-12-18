namespace Purchases.Application.Dtos
{
  public record IncomingDocumentDto : PurchaseBaseDto
  {
    public int? IncomingDocumentId { get; set; }

    public int? EmissionPointId { get; set; }

    public required DateTime DueDate { get; set; }

    public required decimal DiscountAmount { get; set; }

    public int? SubcategoryId { get; set; }
  }
}
