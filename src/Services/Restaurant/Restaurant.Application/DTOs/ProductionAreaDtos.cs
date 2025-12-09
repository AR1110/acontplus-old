using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos;

public record ProductionAreaCreate
{
    [Required][MaxLength(5)] public required string Code { get; init; }
    [Required][MaxLength(100)] public required string Description { get; init; }
    public int EstablishmentId { get; init; }
}

public record ProductionAreaUpdate
{
    [Required][MaxLength(5)] public required string Code { get; init; }
    [Required][MaxLength(100)] public required string Description { get; init; }
    public int EstablishmentId { get; init; }
}

public record ProductionAreaItem
{
    public int Id { get; init; }
    public string Code { get; init; }
    public string Description { get; init; }
    public int EstablishmentId { get; init; }
    public bool IsActive { get; init; }
}
