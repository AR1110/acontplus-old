namespace Mechanical.Application.Dtos;

public record CreateInspectionDto
{
    public int SupportId { get; init; }
    public DateTime Date { get; init; }
    public int Mileage { get; init; }
    public string FuelLevel { get; init; }
    public string Engine { get; init; }
    public string Cabin { get; init; }
    public string Bearing { get; init; }
    public string Transmission { get; init; }
    public string Lighting { get; init; }
    public string Brake { get; init; }
    public string Steering { get; init; }
    public string Suspension { get; init; }
    public string? Obs { get; init; }
}

public record UpdateInspectionDto
{
    public DateTime Date { get; init; }
    public int Mileage { get; init; }
    public string FuelLevel { get; init; }
    public string Engine { get; init; }
    public string Cabin { get; init; }
    public string Bearing { get; init; }
    public string Transmission { get; init; }
    public string Lighting { get; init; }
    public string Brake { get; init; }
    public string Steering { get; init; }
    public string Suspension { get; init; }
    public string? Obs { get; init; }
}

public record InspectionDtos
{
    public CreateInspectionDto Create { get; init; } = new();
    public UpdateInspectionDto Update { get; init; } = new();
}
