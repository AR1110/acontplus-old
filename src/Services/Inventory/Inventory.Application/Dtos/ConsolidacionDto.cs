namespace Inventory.Application.Dtos;

public record ConsolidacionDto
{
    public int IdPuntoEmision { get; set; }
    public int IdTipoDocumento { get; set; }
    public int IdTipoTransaccion { get; set; }
    public DateTime FechaEmision { get; set; }
    public decimal Total { get; set; }
    public string? Observacion { get; set; }
}

public record ConsolidacionUpdateDto
{
    public int IdConsolidacionInventario { get; set; }
    public int IdTipoDocumento { get; set; }
    public int IdTipoTransaccion { get; set; }
    public string? Observacion { get; set; }
    public decimal Total { get; set; }
}

public record ConsolidacionDetalleDto
{
    public int OrderIndex { get; set; }
    public int IdArticulo { get; set; }
    public int IdBodega { get; set; }
    public int IdMedida { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CantidadTransaccion { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }
    public decimal Total { get; set; }
    public string? Nota { get; set; }
    public string? Descripcion { get; set; }
    public decimal Conversion { get; set; }
}

public record ConsolidacionDetalleUpdateDto
{
    public int OrderIndex { get; set; }
    public int IdConsolidacionInventarioDetalle { get; set; }
    public int IdArticulo { get; set; }
    public int IdBodega { get; set; }
    public int IdMedida { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CantidadTransaccion { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal Total { get; set; }
    public string? Nota { get; set; }
    public string? Descripcion { get; set; }
    public bool Estado { get; set; }
    public decimal Conversion { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }
}

public record CreateConsolidacionDto
{
    public required ConsolidacionDto Consolidacion { get; set; }
    public required List<ConsolidacionDetalleDto> Detalles { get; set; }
}

public record UpdateConsolidacionDto
{
    public required ConsolidacionUpdateDto Consolidacion { get; set; }
    public required List<ConsolidacionDetalleUpdateDto> Detalles { get; set; }
}