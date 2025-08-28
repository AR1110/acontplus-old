namespace Mechanical.Application.DTOs;

public record CreateInspectionDto
{
    public int SupportId { get; init; }
    public DateTime Date { get; init; }
    public int Mileage { get; init; }
    public string FuelLevel { get; init; } = string.Empty;
    public string Engine { get; init; } = string.Empty;
    public string Cabin { get; init; } = string.Empty;
    public string Bearing { get; init; } = string.Empty;
    public string Transmission { get; init; } = string.Empty;
    public string Lighting { get; init; } = string.Empty;
    public string Brake { get; init; } = string.Empty;
    public string Steering { get; init; } = string.Empty;
    public string Suspension { get; init; } = string.Empty;
    public string? Obs { get; init; }
}

public record UpdateInspectionDto
{
    public DateTime Date { get; init; }
    public int Mileage { get; init; }
    public string FuelLevel { get; init; } = string.Empty;
    public string Engine { get; init; } = string.Empty;
    public string Cabin { get; init; } = string.Empty;
    public string Bearing { get; init; } = string.Empty;
    public string Transmission { get; init; } = string.Empty;
    public string Lighting { get; init; } = string.Empty;
    public string Brake { get; init; } = string.Empty;
    public string Steering { get; init; } = string.Empty;
    public string Suspension { get; init; } = string.Empty;
    public string? Obs { get; init; }
}

public record InspectionDtos
{
    public CreateInspectionDto Create { get; init; } = new();
    public UpdateInspectionDto Update { get; init; } = new();
}
