namespace Inventory.Application.DTOs;

public record TarifaDto
{
    public string Descripcion { get; set; } = string.Empty;
    public bool Estado { get; set; }
    public bool VentaPorMayor { get; set; }
}
