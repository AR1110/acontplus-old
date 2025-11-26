namespace Inventory.Application.Dtos;

public record CreateEtiquetaDto
{
    public required string Descripcion { get; init; }
    public required string Etiquetas { get; init; }
};

public record UpdateEtiquetaDto
{
    public required string Descripcion { get; init; }
    public required string Etiquetas { get; init; }
    public required bool Estado { get; init; }
}