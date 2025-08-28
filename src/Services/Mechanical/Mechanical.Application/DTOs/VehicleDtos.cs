namespace Mechanical.Application.DTOs;

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
  public string LicensePlate { get; init; } = string.Empty;
  public string Brand { get; init; } = string.Empty;
  public string Model { get; init; } = string.Empty;
  public int Year { get; init; }
  public string Color { get; init; } = string.Empty;
  public string Engine { get; init; } = string.Empty;
  public string Chassis { get; init; } = string.Empty;
  public string Cylindraje { get; init; } = string.Empty;
  public int CustomerId { get; init; }
  public string? Observation { get; init; }
}

public record CustomerDataDto
{
  public string IdType { get; init; } = string.Empty;
  public string IdCard { get; init; } = string.Empty;
  public string BusinessName { get; init; } = string.Empty;
  public string TradeName { get; init; } = string.Empty;
  public string? Email { get; init; }
  public string? Telephone { get; init; }
  public string? Address { get; init; }
}

public record VehicleDtos
{
  public CreateVehicleDto Create { get; init; } = new();
  public UpdateVehicleDto Update { get; init; } = new();
}
