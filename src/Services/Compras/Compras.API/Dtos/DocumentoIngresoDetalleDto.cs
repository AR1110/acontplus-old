namespace Compras.API.Dtos
{
  public record DocumentoIngresoDetalleDto : DetalleBaseDto
  {
    public required int OrderIndex { get; set; }

    public int? IdDocumentoIngresoDetail { get; set; }


    public required bool LlevaInventario { get; set; }

    [Precision(18, 5)]
    public required decimal CantidadTransaccion { get; set; }

    [Precision(18, 5)]
    public required decimal Conversion { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCosto { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCostoFraccionado { get; set; }

    // * Para otras clases con mínimas diferencias
    public int? IdLiquidacionCompraDetalle { get; set; }
  }
}