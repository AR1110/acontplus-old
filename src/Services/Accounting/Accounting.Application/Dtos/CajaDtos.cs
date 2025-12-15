namespace Accounting.Application.Dtos;

public record AsignacionCajaDto
{
    public int IdUsuario { get; init; }
    public int IdTurno { get; init; }
}

public record CreateCajaDto
{
    public AsignacionCajaDto[] Asignacion { get; init; } = Array.Empty<AsignacionCajaDto>();
    public string? Descripcion { get; init; }
}

public record UpdateCajaDto
{
    public AsignacionCajaDto[] Asignacion { get; init; } = Array.Empty<AsignacionCajaDto>();
    public string? Descripcion { get; init; }
}

public record AsignacionCajaUpdateDto
{
    public int IdAsignacionCaja { get; init; }
    public int IdUsuario { get; init; }
    public int IdTurno { get; init; }
}

public record UpdateCajaWithAsignacionDto
{
    public AsignacionCajaUpdateDto[] Asignacion { get; init; } = Array.Empty<AsignacionCajaUpdateDto>();
    public string? Descripcion { get; init; }
}
