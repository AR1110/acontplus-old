namespace Inventory.Application.Dtos;

public record CreateTransferenciaBodegaDto
{
    public ComprobanteTransferenciaBodegaDto Comprobante { get; set; } = new();
    public List<TransferenciaBodegaDetalleDto> Detalles { get; set; } = [];
    public List<TransaccionTransferenciaBodegaDto> Transaccion { get; set; } = [];
    public List<TransaccionTransferenciaBodegaDetalleDto> TransaccionDetalles { get; set; } = [];
}

public record UpdateTransferenciaBodegaDto
{
    public int Id { get; set; }
    public ComprobanteTransferenciaBodegaDto Comprobante { get; set; } = new();
    public List<TransferenciaBodegaDetalleDto> Detalles { get; set; } = [];
    public List<TransaccionTransferenciaBodegaDetalleDto> TransaccionDetalles { get; set; } = [];
}

public record ComprobanteTransferenciaBodegaDto
{
    public int IdPuntoEmision { get; set; }
    public int IdBodegaOrigen { get; set; }
    public int IdBodegaDestino { get; set; }
    public string FechaEmision { get; set; }
    public string? Observacion { get; set; }
    public decimal Total { get; set; }
}

public record TransferenciaBodegaDetalleDto
{
    public int? IdTransferenciaBodegaDetalle { get; set; }
    public int OrderIndex { get; set; }
    public int IdArticulo { get; set; }
    public int IdMedida { get; set; }
    public decimal Cantidad { get; set; }
    public string Descripcion { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal Total { get; set; }
    public bool Estado { get; set; }
}

public record TransaccionTransferenciaBodegaDto
{
    public int IdTipoTransaccion { get; set; }
    public int IdTipoDocumento { get; set; }
    public string FechaEmision { get; set; }
}

public record TransaccionTransferenciaBodegaDetalleDto
{
    public int IdTipoTransaccion { get; set; }
    public int IdTipoDocumento { get; set; }
    public int IdArticulo { get; set; }
    public int IdBodega { get; set; }
    public int IdMedida { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CantidadTransaccion { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal Conversion { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }
    public decimal Total { get; set; }
}
