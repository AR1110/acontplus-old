namespace Inventory.Application.DTOs;

public record StockFisicoDto
{
    public StockFisicoHeaderDto Header { get; init; } = null!;
    public List<StockFisicoDetalleDto> StockFisicoDetalles { get; init; } = [];
}

public record StockFisicoHeaderDto
{
    public string CodEstab { get; init; }
    public int Secuencial { get; init; }
    public DateTime Fecha { get; init; }
    public string Responsable { get; init; }
    public string Obs { get; init; }
    public int PuntoEmisionId { get; init; }
    public string SerieDocumento { get; init; }
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
