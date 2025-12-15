namespace Configuration.Application.Dtos;

public record PrinterCreate
{
    public int PrinterTypeId { get; init; }
    public int EstablecimientoId { get; init; }
    public required string Name { get; init; }
    public required string IpAddress { get; init; }
    public string? Domain { get; init; }
    public bool IsDefault { get; init; }
    public required string Machine { get; init; }
    public bool? ServerDevice { get; init; }
    public string? MacAddress { get; init; }
}

public record PrinterUpdate
{
    public int PrinterTypeId { get; init; }
    public int EstablecimientoId { get; init; }
    public required string Name { get; init; }
    public required string IpAddress { get; init; }
    public string? Domain { get; init; }
    public bool IsDefault { get; init; }
    public required string Machine { get; init; }
    public bool? ServerDevice { get; init; }
    public string? MacAddress { get; init; }
}

public record PrinterItem
{
    public int Id { get; init; }
    public int PrinterTypeId { get; init; }
    public int EstablecimientoId { get; init; }
    public string Name { get; init; }
    public string IpAddress { get; init; }
    public string? Domain { get; init; }
    public bool IsDefault { get; init; }
    public string Machine { get; init; }
    public bool? ServerDevice { get; init; }
    public string? MacAddress { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
