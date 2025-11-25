namespace Sales.Application.Dtos;

public record CreateProformaDto
{
    public ProformaInfoDto Proforma { get; init; } = new();
    public List<ProformaDetalleDto> Detalles { get; init; } = [];
    public List<ProformaImpuestoDto> Impuestos { get; init; } = [];
    public List<ProformaInfoAdicionalDto> InfoAdicional { get; init; } = [];
}

public record UpdateProformaDto
{
    public ProformaInfoDto Proforma { get; init; } = new();
    public List<ProformaDetalleDto> Detalles { get; init; } = [];
    public List<ProformaImpuestoDto> Impuestos { get; init; } = [];
    public List<ProformaInfoAdicionalDto> InfoAdicional { get; init; } = [];
}

public record ProformaInfoDto
{
    public int IdCliente { get; init; }
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
    public string? IdentificacionComprador { get; init; }
    public string? RazonSocialComprador { get; init; }
    public string? DireccionComprador { get; init; }
    public string? Email { get; init; }
    public string? Telefono { get; init; }
}

public record ProformaDetalleDto
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
    public decimal ValorDescuento { get; init; }
    public decimal PorcentajeDescuento { get; init; }
    public decimal PrecioTotalSinImpuesto { get; init; }
    public string CodigoPorcentaje { get; init; }
    public decimal Tarifa { get; init; }
    public decimal ValorImpuesto { get; init; }
    public string? Nota { get; init; }
    public string Descripcion { get; init; }
}

public record ProformaImpuestoDto
{
    public int TaxId { get; init; }
    public int TaxPercentId { get; init; }
    public decimal Percent { get; init; }
    public decimal TaxBase { get; init; }
    public decimal TaxValue { get; init; }
    public decimal Discount { get; init; }
}

public record ProformaInfoAdicionalDto
{
    public string Nombre { get; init; }
    public string Valor { get; init; }
}

// DTO for ConvertToDoc operation
public record ProformaConvertToDocDto
{
    public ProformaInfoDto Proforma { get; init; } = new();
    public List<ProformaDetalleDto> Detalles { get; init; } = [];
    public List<ProformaImpuestoDto> Impuestos { get; init; } = [];
    public List<ProformaInfoAdicionalDto> InfoAdicional { get; init; } = [];
}
