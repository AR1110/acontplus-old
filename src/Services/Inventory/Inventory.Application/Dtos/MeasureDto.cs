namespace Inventory.Application.Dtos;

public record MeasureDto
{
    public required string Descripcion { get; set; }
};

public record UpdateMeasureDto
{
    public required string Descripcion { get; set; }
    public required bool Estado { get; set; }
};
