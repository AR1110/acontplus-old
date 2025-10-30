namespace Inventory.Application.DTOs;

public record MarcaDto
{
    public required string Descripcion { get; set; }
};

public record UpdateMarcaDto
{
    public required string Descripcion { get; set; }
    public required bool Estado { get; set; }
};
