namespace Restaurant.Application.Dtos.Items;
public record ItemResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? Summary { get; set; }
    public bool Cooking { get; set; }
    public string? Recipe { get; set; }
    public string? Instructions { get; set; }
    public string? Content { get; set; }
    public string? AcronymFamily { get; set; }
    public string? Title { get; set; }
    public string? S3ObjectUrl { get; set; }
    public string? Description { get; set; }
    public string? Code { get; set; }
    public string? Measure { get; set; }
    public string? AuxiliarCode { get; set; }
    public decimal CostPrice { get; set; } = 0m;
    public string? Category { get; set; }
    public bool IsActive { get; set; }
}
