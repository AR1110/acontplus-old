namespace Purchases.Application.Dtos
{
  public record IncomingDocumentDto : PurchaseBaseDto
  {
    public int? IdDocumentoIngreso { get; set; }

    public int? IdPuntoEmision { get; set; }

    public required DateTime FechaVencimiento { get; set; }


    public required decimal Descuento { get; set; }

    public int? SubcategoryId { get; set; }
  }
}
