using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.DTOs;

public record CreateMenuDto
{
    [Required]
    public int ProductId { get; init; }

    [Required]
    [MaxLength(500)]
    public string Title { get; init; } = string.Empty;

    [Required]
    public int MenuTypeId { get; init; }

    [MaxLength(500)]
    public string Summary { get; init; } = string.Empty;

    public string Content { get; init; } = string.Empty;

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }

    public string? PromotionDays { get; init; }

    public bool ForPromotion { get; init; }

    public bool Enabled { get; init; } = true;

    public string? S3ObjectUrl { get; init; }

    public List<CreateMenuItemDto> MenuItems { get; init; } = [];
}

public record UpdateMenuDto
{
    [Required]
    public int ProductId { get; init; }

    [Required]
    [MaxLength(500)]
    public string Title { get; init; } = string.Empty;

    [Required]
    public int MenuTypeId { get; init; }

    [MaxLength(500)]
    public string Summary { get; init; } = string.Empty;

    public string Content { get; init; } = string.Empty;

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }

    public string? PromotionDays { get; init; }

    public bool ForPromotion { get; init; }

    public bool Enabled { get; init; } = true;

    public string? S3ObjectUrl { get; init; }

    public List<UpdateMenuItemDto> MenuItems { get; init; } = [];
}

public record CreateMenuItemDto
{
    public int Id { get; init; }

    public int ItemId { get; init; }

    public int ProductId { get; init; }

    public decimal CostPrice { get; init; }

    [MaxLength(500)]
    public string Descripcion { get; init; } = string.Empty;

    public int MenuId { get; init; }

    public decimal Quantity { get; init; }

    public decimal PercentageDiscount { get; init; }

    public decimal Total { get; init; }
}

public record UpdateMenuItemDto
{
    public int Id { get; init; }

    public int ItemId { get; init; }

    public int ProductId { get; init; }

    public decimal CostPrice { get; init; }

    [MaxLength(500)]
    public string Descripcion { get; init; } = string.Empty;

    public int MenuId { get; init; }

    public decimal Quantity { get; init; }

    public decimal PercentageDiscount { get; init; }

    public decimal Total { get; init; }
}
