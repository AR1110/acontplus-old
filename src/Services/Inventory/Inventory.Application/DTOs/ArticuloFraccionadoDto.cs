namespace Inventory.Application.DTOs;

public record PvpDto
{
    public int IdTarifa { get; set; }
    public decimal PrecioVenta { get; set; }
    public decimal PrecioConIva { get; set; }
    public decimal PorcentajeUtilidad { get; set; }
}

public record PvpUpdateDto
{
    public int IdArticuloFraccionadoPvP { get; set; }
    public decimal PrecioVenta { get; set; }
    public decimal PrecioConIva { get; set; }
    public decimal PorcentajeUtilidad { get; set; }
};

public record CreateArticuloFraccionadoDto
{
    public int IdArticulo { get; set; }
    public int IdMedida { get; set; }
    public decimal Conversion { get; set; }
    public bool GestionVenta { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }
    public string? Pvps { get; set; }
}

public record UpdateArticuloFraccionadoDto
{
    public int IdArticulo { get; set; }
    public int IdMedida { get; set; }
    public decimal Conversion { get; set; }
    public bool GestionVenta { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }
    public string? Pvps { get; set; }
}
