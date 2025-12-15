namespace Accounting.Application.Dtos;

public record AccountCreate
{
    public int? ParentAccountId { get; init; }
    public int? TipoId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required string Hierarchy { get; init; }
    public bool Level { get; init; }
}

public record AccountUpdate
{
    public int? ParentAccountId { get; init; }
    public int? TipoId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required string Hierarchy { get; init; }
    public bool Level { get; init; }
}

public record AccountItem
{
    public int Id { get; init; }
    public int? ParentAccountId { get; init; }
    public int? TipoId { get; init; }
    public string Code { get; init; }
    public string Name { get; init; }
    public string Hierarchy { get; init; }
    public bool Level { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
