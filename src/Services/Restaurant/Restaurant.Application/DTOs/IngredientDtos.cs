using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos;

public record CreateIngredientDto
{
    public int ProductId { get; init; }
    [Required]
    [MaxLength(500)]
    public string Summary { get; init; }
    public int TypeId { get; init; }
    public int Quantity { get; init; }
    public int Unit { get; init; }
    public string Content { get; init; }
}

public record CreateIngredientRequestDto
{
    [Required]
    public ProductJsonDto ProductJson { get; init; } = new();
    [Required]
    public IngredientJsonDto IngredientJson { get; init; } = new();
}

public record ProductJsonDto
{
    [Required]
    public int ProductId { get; init; }
}

public record IngredientJsonDto
{
    [Required]
    [MaxLength(500)]
    public string Summary { get; init; }
    [Required]
    public int TypeId { get; init; }
    [Required]
    public int Quantity { get; init; }
    [Required]
    public int Unit { get; init; }
    public string Content { get; init; }
}

public record UpdateIngredientDto
{
    [Required]
    public int ProductId { get; init; }
    [Required]
    [MaxLength(500)]
    public string Summary { get; init; }
    public int? IngredientTypeId { get; init; }
    public int? Quantity { get; init; }
    public int? Unit { get; init; }
    public string Content { get; init; }
}
