namespace Accounting.Application.Dtos;

public record CategoryCreate
{
    public int TipoId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record CategoryUpdate
{
    public int TipoId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record CategoryItem
{
    public int Id { get; init; }
    public int TipoId { get; init; }
    public string Code { get; init; }
    public string Name { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
