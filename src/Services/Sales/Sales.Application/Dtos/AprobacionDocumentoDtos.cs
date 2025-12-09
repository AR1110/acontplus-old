namespace Sales.Application.Dtos;

// DTO for creating a new AprobacionDocumento
public record CreateAprobacionDocumentoDto
{
    public ComprobanteDto Comprobante { get; init; } = new();
    public List<DetalleDto> Detalles { get; init; } = [];
    public List<ImpuestoDto> Impuestos { get; init; } = [];
    public List<InfoAdicionalDto> InfoAdicional { get; init; } = [];
    public List<InfoAdicionalArticuloDto> InfoAdicionalArticulo { get; init; } = [];
    public HistorialDto Historial { get; init; } = new();
}

// DTO for updating an existing AprobacionDocumento
public record UpdateAprobacionDocumentoDto
{
    public ComprobanteDto Comprobante { get; init; } = new();
    public List<DetalleDto> Detalles { get; init; } = [];
    public List<ImpuestoDto> Impuestos { get; init; } = [];
    public List<InfoAdicionalDto> InfoAdicional { get; init; } = [];
    public List<InfoAdicionalArticuloDto> InfoAdicionalArticulo { get; init; } = [];
}

// DTO for converting AprobacionDocumento to Document
public record ConvertToDocumentDto
{
    public ComprobanteConvertDto Comprobante { get; init; } = new();
    public List<DetalleConvertDto> Detalles { get; init; } = [];
    public List<ImpuestoDto> Impuestos { get; init; } = [];
    public List<InfoAdicionalDto> InfoAdicional { get; init; } = [];
    public FormaPagoDto FormaPago { get; init; } = new();
    public List<CuotaDto> Cuotas { get; init; } = [];
}

// Supporting DTOs based on OPENJSON mappings from SPs
public record ComprobanteDto
{
    public int IdCliente { get; init; }
    public int IdPuntoEmision { get; init; }
    public int IdUsuario { get; init; }
    public int IdTipoDocumento { get; init; }
    public int IdTipoDocOrigen { get; init; }
    public DateTime FechaEmision { get; init; }
    public decimal TotalSinImpuestos { get; init; }
    public decimal TotalDescuento { get; init; }
    public decimal Propina { get; init; }
    public decimal ImporteTotal { get; init; }
    public string? Observacion { get; init; }
}

public record ComprobanteConvertDto
{
    public int IdCliente { get; init; }
    public int IdTiempoCredito { get; init; }
    public int IdPuntoEmision { get; init; }
    public int IdUsuario { get; init; }
    public int IdAprobDocument { get; init; }
    public DateTime FechaEmision { get; init; }
    public DateTime FechaVencimiento { get; init; }
    public decimal SubTotalSinImpuestos { get; init; }
    public decimal TotalDescuento { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public decimal Propina { get; init; }
    public decimal Recargo { get; init; }
    public decimal Transporte { get; init; }
    public decimal Total { get; init; }
    public string? Observacion { get; init; }
    public string DocDestino { get; init; }
    public string CodDoc { get; init; }
}

public record DetalleDto
{
    public int OrderIndex { get; init; }
    public int IdTarifa { get; init; }
    public int IdArticulo { get; init; }
    public int IdMedida { get; init; }
    public int IdTipoIva { get; init; }
    public int IdBodega { get; init; }
    public decimal Cantidad { get; init; }
    public string Descripcion { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal Descuento { get; init; }
    public decimal PrecioTotalSinImpuesto { get; init; }
    public string CodigoPorcentaje { get; init; }
    public decimal Tarifa { get; init; }
    public decimal ValorImpuesto { get; init; }
    public DateTime FechaEmision { get; init; }
    public string? Nota { get; init; }
}

public record DetalleConvertDto
{
    public int OrderIndex { get; init; }
    public int IdArticulo { get; init; }
    public int IdTarifa { get; init; }
    public int IdBodega { get; init; }
    public int? IdMedida { get; init; }
    public decimal Ice { get; init; }
    public decimal Cantidad { get; init; }
    public decimal PrecioSinSubsidio { get; init; }
    public decimal PrecioUnitario { get; init; }
    public decimal PrecioCosto { get; init; }
    public decimal ValorDescuento { get; init; }
    public decimal PrecioTotalSinImpuesto { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public string CodigoPorcentaje { get; init; }
    public decimal Tarifa { get; init; }
    public decimal ValorImpuesto { get; init; }
    public string? Nota { get; init; }
    public string Descripcion { get; init; }
    public int IdTipoIva { get; init; }
    public bool LlevaInventario { get; init; }
    public decimal CantidadTransaccion { get; init; }
    public decimal Conversion { get; init; }
    public decimal PrecioCostoFraccionado { get; init; }
}

public record ImpuestoDto
{
    public int TaxId { get; init; }
    public int TaxPercentId { get; init; }
    public decimal Percent { get; init; }
    public decimal TaxBase { get; init; }
    public decimal TaxValue { get; init; }
    public decimal Discount { get; init; }
}

public record HistorialDto
{
    public int? IdNotaEntrega { get; init; }
    public int? IdProforma { get; init; }
}

public record InfoAdicionalDto
{
    public string Nombre { get; init; }
    public string Valor { get; init; }
}

public record InfoAdicionalArticuloDto
{
    public int IdInfoAdicional { get; init; }
}

public record FormaPagoDto
{
    public int? IdFormaPagoSri { get; init; }
    public int? IdTiempoCredito { get; init; }
    public decimal Total { get; init; }
}

public record CuotaDto
{
    public int NroCuota { get; init; }
    public DateTime FechaVencimiento { get; init; }
    public decimal Cuota { get; init; }
    public bool Entrada { get; init; }
}
