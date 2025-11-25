namespace Mechanical.Application.Dtos;

public record CreateSupportDto
{
    public int PuntoEmisionId { get; init; }
    public int VehicleCompanyId { get; init; }
    public int CustomerId { get; init; }
    public int SupportTypeId { get; init; }
    public int UserAssignedId { get; init; }
    public string Obs { get; init; }
    public DateTime Date { get; init; }
}

public record UpdateSupportDto
{
    public int PuntoEmisionId { get; init; }
    public int VehicleCompanyId { get; init; }
    public int CustomerId { get; init; }
    public int SupportTypeId { get; init; }
    public int UserAssignedId { get; init; }
    public string Obs { get; init; }
    public DateTime Date { get; init; }
}

public record SupportDtos
{
    public CreateSupportDto Create { get; init; } = new();
    public UpdateSupportDto Update { get; init; } = new();
}
