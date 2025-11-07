namespace Restaurant.Application.Dtos.Items;
public record ItemResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public bool Cooking { get; set; }
    public string Recipe { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
