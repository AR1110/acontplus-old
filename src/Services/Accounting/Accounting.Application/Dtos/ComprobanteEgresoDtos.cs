namespace Accounting.Application.Dtos;

public record ComprobanteEgresoDto
{
    public int IdProveedor { get; init; }
    public decimal Total { get; init; }
    public required string CodEstab { get; init; }
    public string? Observacion { get; init; }
}

public record CreateComprobanteEgresoDto
{
    public ComprobanteEgresoDto Comprobante { get; init; } = null!;
    public IEnumerable<PagoDto> Pagos { get; init; } = null!;
    public IEnumerable<PagoDetalleDto> PagoDetalle { get; init; } = null!;
    public IEnumerable<HistorialDto> Historial { get; init; } = null!;
    public IEnumerable<CuentaDto> Cuenta { get; init; } = null!;
    public IEnumerable<CuotaDto> Cuota { get; init; } = null!;
}

public record UpdateComprobanteEgresoDto
{
    public ComprobanteEgresoDto Comprobante { get; init; } = null!;
    public IEnumerable<PagoDto> Pagos { get; init; } = null!;
    public IEnumerable<PagoDetalleDto> PagoDetalle { get; init; } = null!;
    public IEnumerable<HistorialDto> Historial { get; init; } = null!;
    public IEnumerable<CuentaDto> Cuenta { get; init; } = null!;
    public IEnumerable<CuotaDto> Cuota { get; init; } = null!;
}

public record PagoDto
{
    public int IdSubEntidadFinanciera { get; init; }
    public int IdEntidadFinanciera { get; init; }
    public int? IdBanco { get; init; }
    public int? IdComprobante { get; init; }
    public DateTime FechaEmision { get; init; }
    public string? Nro { get; init; }
    public decimal Valor { get; init; }
    public decimal AmountPaid { get; init; }
    public bool Posfechado { get; init; }
    public int Secuencial { get; init; }
    public bool Cobro { get; init; }
    public string? Lote { get; init; }
    public string? Referencia { get; init; }
    public string? Aprobacion { get; init; }
    public bool ControlCaja { get; init; }
}

public record PagoDetalleDto
{
    public int IdCuotaPorPagar { get; init; }
    public int Secuencial { get; init; }
    public decimal Balance { get; init; }
    public decimal AmountPaid { get; init; }
}

public record HistorialDto
{
    public int IdCuentaPorPagar { get; init; }
    public int Secuencial { get; init; }
    public decimal Balance { get; init; }
    public decimal AmountPaid { get; init; }
}

public record CuentaDto
{
    public int IdCuentaPorPagar { get; init; }
    public int IdEstadoPago { get; init; }
    public decimal AmountPaid { get; init; }
}

public record CuotaDto
{
    public int IdCuotaPorPagar { get; init; }
    public int IdEstadoPago { get; init; }
    public decimal AmountPaid { get; init; }
}
