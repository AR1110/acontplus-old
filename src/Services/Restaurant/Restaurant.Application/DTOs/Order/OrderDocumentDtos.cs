using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos.Order;

public record OrderDocumentCreate
{
    public int OrderId { get; init; }
    [Required][MaxLength(50)] public required string DocumentType { get; init; }
    [Required][MaxLength(100)] public required string DocumentNumber { get; init; }
    [MaxLength(500)] public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    [MaxLength(1000)] public string? Notes { get; init; }
}

public record OrderDocumentUpdate
{
    public int OrderId { get; init; }
    [Required][MaxLength(50)] public required string DocumentType { get; init; }
    [Required][MaxLength(100)] public required string DocumentNumber { get; init; }
    [MaxLength(500)] public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    [MaxLength(1000)] public string? Notes { get; init; }
}

public record OrderDocumentItem
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public string DocumentType { get; init; }
    public string DocumentNumber { get; init; }
    public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    public string? Notes { get; init; }
    public bool IsActive { get; init; }
}
