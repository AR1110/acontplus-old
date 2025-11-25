namespace Accounting.Application.Dtos;

public record ComprobanteIngresoDto
{
    public int IdCliente { get; init; }
    public decimal Total { get; init; }
    public decimal Abono { get; init; }
    public string CodEstab { get; init; } = null!;
    public string? Observacion { get; init; }
}

public record CreateComprobanteIngresoDto
{
    public ComprobanteIngresoDto Comprobante { get; init; } = null!;
    public IEnumerable<CobroDto> Cobros { get; init; } = null!;
    public IEnumerable<CobroDetalleDto> CobroDetalle { get; init; } = null!;
    public IEnumerable<HistorialCobroDto> Historial { get; init; } = null!;
    public IEnumerable<CuentaCobroDto> Cuenta { get; init; } = null!;
    public IEnumerable<CuotaCobroDto> Cuota { get; init; } = null!;
}

public record UpdateComprobanteIngresoDto
{
    public IEnumerable<CobroUpdateDto>? Cobro { get; init; }
    public IEnumerable<CuentaCobroDto>? Cuenta { get; init; }
    public IEnumerable<CuotaCobroDto>? Cuota { get; init; }
}

public record CobroDto
{
    public int IdSubEntidadFinanciera { get; init; }
    public int IdEntidadFinanciera { get; init; }
    public int? IdBanco { get; init; }
    public int? IdCuentaBancaria { get; init; }
    public int? IdTipoDocumento { get; init; }
    public int? IdCuentaPorCobrar { get; init; }
    public DateTime FechaEmision { get; init; }
    public decimal Valor { get; init; }
    public decimal Abono { get; init; }
    public bool Posfechado { get; init; }
    public int Secuencial { get; init; }
    public bool Cobro { get; init; }
    public string? InfoCobro { get; init; }
    public bool ControlCaja { get; init; }
}

public record CobroUpdateDto
{
    public int Id { get; init; }
    public int? IdCobro { get; init; }
    public string Observacion { get; init; } = null!;
    public bool Estado { get; init; }
}

public record CobroDetalleDto
{
    public int IdCuotaPorCobrar { get; init; }
    public decimal Saldo { get; init; }
    public decimal Abono { get; init; }
    public decimal Interes { get; init; }
    public int DiasMora { get; init; }
    public decimal Mora { get; init; }
    public int Secuencial { get; init; }
}

public record HistorialCobroDto
{
    public int IdCuentaPorCobrar { get; init; }
    public int Secuencial { get; init; }
    public decimal Saldo { get; init; }
    public decimal Abono { get; init; }
    public decimal Mora { get; init; }
    public int DiasMora { get; init; }
}

public record CuentaCobroDto
{
    public int IdCuentaPorCobrar { get; init; }
    public int IdEstadoPago { get; init; }
    public decimal Abono { get; init; }
    public decimal Mora { get; init; }
    public int DiasMora { get; init; }
}

public record CuotaCobroDto
{
    public int IdCuotaPorCobrar { get; init; }
    public int IdEstadoPago { get; init; }
    public decimal Abono { get; init; }
    public decimal Mora { get; init; }
    public int DiasMora { get; init; }
}
