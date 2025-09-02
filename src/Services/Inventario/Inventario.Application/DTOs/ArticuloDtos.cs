namespace Inventario.Application.DTOs;

public record CreateArticuloDto
{
    public string Codigo { get; init; } = string.Empty;
}

public record UpdateArticuloDto
{
    public int IdArticulo { get; set; }
    public string Codigo { get; init; } = string.Empty;
}
