namespace Restaurant.Application.Dtos.Items;

public record ItemListResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public bool Cooking { get; set; }
    public string Recipe { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string S3ObjectUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Measure { get; set; } = string.Empty;
    public string AuxiliarCode { get; set; } = string.Empty;
    public decimal CostPrice { get; set; } = 0m;
    public string? Category { get; set; } 
    public bool IsActive { get; set; }
}
