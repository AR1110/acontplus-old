namespace Inventory.Application.Dtos;

public record PrecioMasivoDto
{
    public int Tipo { get; init; }
    public List<ArticuloPrecioDto> Articulos { get; init; } = [];
}

public record ArticuloPrecioDto
{
    // For regular articles
    public int? IdArticuloPvP { get; init; }
    public int? IdArticulo { get; init; }

    // For fractioned articles
    public int? IdArticuloFraccionadoPvP { get; init; }
    public int? IdArticuloFraccionado { get; init; }

    // Common properties
    public int IdTarifa { get; init; }
    public int IdTipoIva { get; init; }
    public decimal PrecioVenta { get; init; }
    public decimal PrecioConIva { get; init; }
    public decimal PorcentajeUtilidad { get; init; }
}
