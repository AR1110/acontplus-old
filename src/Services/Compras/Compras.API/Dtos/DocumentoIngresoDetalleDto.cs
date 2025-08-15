namespace Compras.API.Dtos
{
  public record DocumentoIngresoDetalleDto : DetalleBaseDto
  {
    public required int OrderIndex { get; set; }

    public int? IdDocumentoIngresoDetail { get; set; }

    [Precision(18, 5)]
    public required decimal Descuento { get; set; }

    public required bool LlevaInventario { get; set; }

    [Precision(18, 5)]
    public required decimal CantidadTransaccion { get; set; }

    [Precision(18, 5)]
    public required decimal Conversion { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCosto { get; set; }

    [Precision(18, 5)]
    public required decimal PrecioCostoFraccionado { get; set; }

    public bool? Estado { get; set; } = true;
  }
}