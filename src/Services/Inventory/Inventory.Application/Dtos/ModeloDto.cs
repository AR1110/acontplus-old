namespace Inventory.Application.Dtos;

public record ModeloDto
{
    public required string Descripcion { get; set; }
    public required int IdMarca { get; set; }
};

public record UpdateModeloDto
{
    public required string Descripcion { get; set; }
    public required int IdMarca { get; set; }
    public required bool Estado { get; set; }
};
