namespace Accounting.Application.Dtos;

public record TipoCreate
{
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record TipoUpdate
{
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record TipoItem
{
    public int Id { get; init; }
    public string Code { get; init; }
    public string Name { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
