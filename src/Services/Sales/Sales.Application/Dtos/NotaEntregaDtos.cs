namespace Sales.Application.DTOs;

public record CreateNotaEntregaDto
{
    public NotaEntregaInfoDto InfoNotaEntrega { get; init; } = new();
    public List<NotaEntregaDetalleDto> Detalles { get; init; } = [];
    public List<NotaEntregaImpuestoDto> Impuestos { get; init; } = [];
    public List<NotaEntregaInfoAdicionalDto> InfoAdicional { get; init; } = [];
}

public record UpdateNotaEntregaDto
{
    public NotaEntregaInfoDto InfoNotaEntrega { get; init; } = new();
    public List<NotaEntregaDetalleDto> Detalles { get; init; } = [];
    public List<NotaEntregaImpuestoDto> Impuestos { get; init; } = [];
    public List<NotaEntregaInfoAdicionalDto> InfoAdicional { get; init; } = [];
}

public record NotaEntregaInfoDto
{
    public int IdCliente { get; init; }
    public int IdFactura { get; init; }
    public int IdPuntoEmision { get; init; }
    public int IdUsuario { get; init; }
    public DateTime FechaEmision { get; init; }
    public decimal SubTotalSinImpuestos { get; init; }
    public decimal TotalDescuento { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public decimal Propina { get; init; }
    public decimal Recargo { get; init; }
    public decimal Transporte { get; init; }
    public decimal Total { get; init; }
    public string? Observacion { get; init; }
}

public record NotaEntregaDetalleDto
{
    public int OrderIndex { get; init; }
    public int IdArticulo { get; init; }
    public int IdTarifa { get; init; }
    public int IdBodega { get; init; }
    public int? IdMedida { get; init; }
    public int IdTipoIva { get; init; }
    public decimal Ice { get; init; }
    public decimal Cantidad { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal PrecioCosto { get; init; }
    public decimal ValorDescuento { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public decimal PrecioTotalSinImpuesto { get; init; }
    public string CodigoPorcentaje { get; init; }
    public decimal Tarifa { get; init; }
    public decimal ValorImpuesto { get; init; }
    public string? Nota { get; init; }
    public string Descripcion { get; init; }
    public bool LlevaInventario { get; init; }
    public decimal CantidadTransaccion { get; init; }
    public decimal Conversion { get; init; }
    public decimal PrecioCostoFraccionado { get; init; }
}

public record NotaEntregaImpuestoDto
{
    public int TaxId { get; init; }
    public int TaxPercentId { get; init; }
    public decimal Percent { get; init; }
    public decimal TaxBase { get; init; }
    public decimal TaxValue { get; init; }
    public decimal Discount { get; init; }
}

public record NotaEntregaInfoAdicionalDto
{
    public string Nombre { get; init; }
    public string Valor { get; init; }
}

// DTOs for ConvertToDoc operation
public record NotaEntregaConvertToDocDto
{
    public NotaEntregaComprobanteDto Comprobante { get; init; } = new();
    public List<NotaEntregaDetalleDto> Detalles { get; init; } = [];
    public List<NotaEntregaFormaPagoDto> FormaPago { get; init; } = [];
    public List<NotaEntregaImpuestoDto> Impuestos { get; init; } = [];
    public List<NotaEntregaInfoAdicionalDto> InfoAdicional { get; init; } = [];
    public List<NotaEntregaCuotaDto> Cuotas { get; init; } = [];
}

public record NotaEntregaComprobanteDto
{
    public int IdCliente { get; init; }
    public int IdTiempoCredito { get; init; }
    public int IdPuntoEmision { get; init; }
    public int IdUsuario { get; init; }
    public DateTime FechaEmision { get; init; }
    public DateTime FechaVencimiento { get; init; }
    public decimal SubTotalSinImpuestos { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public decimal TotalDescuento { get; init; }
    public decimal Propina { get; init; }
    public decimal Recargo { get; init; }
    public decimal Transporte { get; init; }
    public decimal Total { get; init; }
    public string? Observacion { get; init; }
    public int IdNotaEntrega { get; init; }
    public string DocDestino { get; init; }
}

public record NotaEntregaFormaPagoDto
{
    public int IdFormaPagoSri { get; init; }
    public int IdTiempoCredito { get; init; }
    public decimal Total { get; init; }
}

public record NotaEntregaCuotaDto
{
    public int NroCuota { get; init; }
    public DateTime FechaVencimiento { get; init; }
    public decimal Cuota { get; init; }
    public bool Entrada { get; init; }
}
