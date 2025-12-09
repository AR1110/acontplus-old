namespace Inventory.Application.Dtos;

public record CreateArticuloCodigoBarraDto
{
    public required int IdArticulo { get; set; }
    public required int IdMedida { get; set; }
    public required string CodigoBarra { get; set; }
    public required string Descripcion { get; set; }
    public required string Color { get; set; }
}

public record UpdateArticuloCodigoBarraDto
{
    public required int IdMedida { get; set; }
    public required string CodigoBarra { get; set; }
    public required string Descripcion { get; set; }
    public required string Color { get; set; }
}
