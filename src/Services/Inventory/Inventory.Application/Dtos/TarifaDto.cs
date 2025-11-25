namespace Inventory.Application.Dtos;

public record TarifaDto
{
    public string Descripcion { get; set; }
    public bool Estado { get; set; }
    public bool VentaPorMayor { get; set; }
}
