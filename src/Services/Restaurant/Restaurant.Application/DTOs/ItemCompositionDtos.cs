using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos;

public record ItemCompositionCreate
{
    public int ParentItemId { get; init; }
    public int ChildItemId { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal TotalCost { get; init; }
    public decimal TotalPrice { get; init; }
    public decimal? WastePercentage { get; init; }
    public int MeasureId { get; init; }
    public bool IsOptional { get; init; }
    public bool IsDefault { get; init; }
    public decimal? ExtraCharge { get; init; }
    public int DisplayOrder { get; init; }
    public int CompositionLevel { get; init; } = 1;
    [MaxLength(300)] public string? Notes { get; init; }
    public Guid? UniqueId { get; init; }
    public int? ParentCompositionId { get; init; }
}

public record ItemCompositionUpdate
{
    public int Id { get; init; }
    public int ParentItemId { get; init; }
    public int ChildItemId { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal TotalCost { get; init; }
    public decimal TotalPrice { get; init; }
    public decimal? WastePercentage { get; init; }
    public int FeeId { get; init; }
    public int MeasureId { get; init; }
    public bool IsOptional { get; init; }
    public bool IsDefault { get; init; }
    public decimal? ExtraCharge { get; init; }
    public int DisplayOrder { get; init; }
    public int CompositionLevel { get; init; }
    [MaxLength(300)] public string? Notes { get; init; }
    public Guid? UniqueId { get; init; }
    public int? ParentCompositionId { get; init; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; } = false;
}

public record ItemCompositionItem
{
    public int Id { get; init; }
    public int ParentItemId { get; init; }
    public int ChildItemId { get; init; }
    public decimal Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal SalePrice { get; init; }
    public decimal TotalCost { get; init; }
    public decimal TotalPrice { get; init; }
    public decimal? WastePercentage { get; init; }
    public int MeasureId { get; init; }
    public bool IsOptional { get; init; }
    public bool IsDefault { get; init; }
    public decimal? ExtraCharge { get; init; }
    public int DisplayOrder { get; init; }
    public int CompositionLevel { get; init; }
    public string? Notes { get; init; }
    public Guid? UniqueId { get; init; }
    public int? ParentCompositionId { get; init; }
    public bool IsActive { get; init; }
    public decimal Stock { get; init; }
}
