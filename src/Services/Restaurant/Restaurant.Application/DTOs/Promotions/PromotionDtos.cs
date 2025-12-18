using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos.Promotions;

public record PromotionCreate
{
    public int EstablishmentId { get; init; }
    [MaxLength(100)] public required string Name { get; init; }
    [MaxLength(500)] public string? Description { get; init; }
    public string? StartDate { get; init; }
    public string? EndDate { get; init; }

    public string? ApplicableDays { get; init; }
    public TimeSpan? StartTime { get; init; }
    public TimeSpan? EndTime { get; init; }
    public int Type { get; init; }
    public decimal? DiscountPercent { get; init; }
    public int? MaxUsesPerCustomer { get; init; }
    public int? MaxTotalUses { get; init; }
    public int CurrentUses { get; init; }
    [MaxLength(800)] public string? ImageUrl { get; init; }
    [MaxLength(500)] public string? ImageKey { get; init; }
    public ICollection<PromotionDetailCreate>? details { get; init; }
    public bool IsActive { get; init; }
}

public record PromotionUpdate
{
    public int EstablishmentId { get; init; }
    [MaxLength(100)] public required string Name { get; init; }
    [MaxLength(500)] public string? Description { get; init; }
    public string? StartDate { get; init; }
    public string? EndDate { get; init; }

    public string? ApplicableDays { get; init; }
    public TimeSpan? StartTime { get; init; }
    public TimeSpan? EndTime { get; init; }
    public int Type { get; init; }
    public decimal? DiscountPercent { get; init; }
    public int? MaxUsesPerCustomer { get; init; }
    public int? MaxTotalUses { get; init; }
    public int CurrentUses { get; init; }
    [MaxLength(800)] public string? ImageUrl { get; init; }
    [MaxLength(500)] public string? ImageKey { get; init; }
    public ICollection<PromotionDetailUpdate>? details { get; init; }
    public bool IsActive { get; init; }
    public bool IsDeleted { get; init; }
}

public record PromotionItem
{
    public int Id { get; init; }
    public int EstablishmentId { get; init; }
    public string Name { get; init; }
    public string? Description { get; init; }
    public string StartDate { get; init; }
    public string EndDate { get; init; }
    public string? ApplicableDays { get; init; }
    public TimeSpan? StartTime { get; init; }
    public TimeSpan? EndTime { get; init; }
    public int Type { get; init; }
    public decimal? DiscountPercent { get; init; }
    public int? MaxUsesPerCustomer { get; init; }
    public int? MaxTotalUses { get; init; }
    public int CurrentUses { get; init; }
    public string? ImageUrl { get; init; }
    public string? ImageKey { get; init; }
    public bool IsActive { get; init; }
}
