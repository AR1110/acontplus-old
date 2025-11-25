namespace Mechanical.Application.Dtos;

public record CreateVehicleDto
{
    public VehicleDataDto Vehicle { get; init; } = new();
    public CustomerDataDto Customer { get; init; } = new();
}

public record UpdateVehicleDto
{
    public int Id { get; init; }
    public VehicleDataDto Vehicle { get; init; } = new();
    public CustomerDataDto Customer { get; init; } = new();
}

public record VehicleDataDto
{
    public int VehicleTypeId { get; init; }
    public int CountryId { get; init; }
    public string LicensePlate { get; init; }
    public string Brand { get; init; }
    public string Model { get; init; }
    public int Year { get; init; }
    public string Color { get; init; }
    public string Engine { get; init; }
    public string Chassis { get; init; }
    public string Cylindraje { get; init; }
    public int CustomerId { get; init; }
    public string? Observation { get; init; }
}

public record CustomerDataDto
{
    public string IdType { get; init; }
    public string IdCard { get; init; }
    public string BusinessName { get; init; }
    public string TradeName { get; init; }
    public string? Email { get; init; }
    public string? Telephone { get; init; }
    public string? Address { get; init; }
}

public record VehicleDtos
{
    public CreateVehicleDto Create { get; init; } = new();
    public UpdateVehicleDto Update { get; init; } = new();
}
