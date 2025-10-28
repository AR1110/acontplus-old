using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.DTOs;

public record CreateItemDto
{
    [Required]
    public int ProductId { get; init; }

    [MaxLength(500)]
    public string Summary { get; init; } = string.Empty;

    public bool Cooking { get; init; }

    public string Recipe { get; init; } = string.Empty;

    public string Instructions { get; init; } = string.Empty;

    [MaxLength(500)]
    public string Content { get; init; } = string.Empty;

    public bool Enabled { get; init; } = true;

    public List<CreateRecipeDto> RecipeJson { get; init; } = new();

    public CreateProductionAreaDto ProductionAreaJson { get; init; } = new();
}

public record UpdateItemDto
{
    [Required]
    public int ProductId { get; init; }

    [MaxLength(500)]
    public string Summary { get; init; } = string.Empty;

    public bool Cooking { get; init; }

    public string Recipe { get; init; } = string.Empty;

    public string Instructions { get; init; } = string.Empty;

    [MaxLength(500)]
    public string Content { get; init; } = string.Empty;

    public bool Enabled { get; init; } = true;

    public List<UpdateRecipeDto> RecipeJson { get; init; } = new();

    public UpdateProductionAreaDto ProductionAreaJson { get; init; } = new();
}

public record CreateRecipeDto
{
    public int Id { get; init; }

    public int ItemId { get; init; }

    public int Unit { get; init; }

    public decimal Weight { get; init; }

    public decimal NetWeight { get; init; }

    public int IngredientId { get; init; }

    public string Instructions { get; init; } = string.Empty;

    public float Quantity { get; init; }

    public bool Enabled { get; init; } = true;

    public int ExtentId { get; init; }

    public decimal CostPrice { get; init; }
}

public record UpdateRecipeDto
{
    public int Id { get; init; }

    public int ItemId { get; init; }

    public int Unit { get; init; }

    public decimal Weight { get; init; }

    public decimal NetWeight { get; init; }

    public int IngredientId { get; init; }

    public string Instructions { get; init; } = string.Empty;

    public float Quantity { get; init; }

    public bool Enabled { get; init; } = true;

    public int ExtentId { get; init; }

    public decimal CostPrice { get; init; }
}

public record CreateProductionAreaDto
{
    public int ProductionAreaId { get; init; }
}

public record UpdateProductionAreaDto
{
    public int ProductionAreaId { get; init; }
}
