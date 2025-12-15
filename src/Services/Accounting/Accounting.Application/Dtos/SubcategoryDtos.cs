namespace Accounting.Application.Dtos;

public record SubcategoryCreate
{
    public int CategoryId { get; init; }
    public int CompanyId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record SubcategoryUpdate
{
    public int CategoryId { get; init; }
    public int CompanyId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
}

public record SubcategoryItem
{
    public int Id { get; init; }
    public int CategoryId { get; init; }
    public int CompanyId { get; init; }
    public string Code { get; init; }
    public string Name { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
