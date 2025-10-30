namespace Inventory.Application.DTOs;

public record StockFisicoDto
{
    public StockFisicoHeaderDto Header { get; init; } = null!;
    public List<StockFisicoDetalleDto> StockFisicoDetalles { get; init; } = new();
}

public record StockFisicoHeaderDto
{
    public string CodEstab { get; init; } = string.Empty;
    public int Secuencial { get; init; }
    public DateTime Fecha { get; init; }
    public string Responsable { get; init; } = string.Empty;
    public string Obs { get; init; } = string.Empty;
    public int PuntoEmisionId { get; init; }
    public string SerieDocumento { get; init; } = string.Empty;
}

public record StockFisicoDetalleDto
{
    public int BodegaId { get; init; }
    public int ArticuloId { get; init; }
    public decimal CantidadContada { get; init; }
    public decimal StockActual { get; init; }
    public decimal Discrepancia { get; init; }
    public string? MotivoDiscrepanciaId { get; init; }
    public string? OtroMotivo { get; init; }
}
