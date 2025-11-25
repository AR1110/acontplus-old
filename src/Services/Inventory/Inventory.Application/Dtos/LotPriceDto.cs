namespace Inventory.Application.DTOs;

public record LotPriceDto
{
    public required int Tipo { get; set; }
    public required List<ArticlePvpDto>? Articles { get; set; }
};

public record ArticlePvpDto
{
    public int? IdArticuloPvP { get; set; }
    public int? IdArticulo { get; set; }
    public int? IdArticuloFraccionadoPvP { get; set; }
    public int? IdArticuloFraccionado { get; set; }
    public required int IdTarifa { get; set; }
    public required int IdTipoIva { get; set; }
    public required decimal PrecioVenta { get; set; }
    public required decimal PrecioConIva { get; set; }
    public required decimal PorcentajeUtilidad { get; set; }
};
