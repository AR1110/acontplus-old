namespace Restaurant.Application.DTOs.Promotions;
public record PromotionResponse
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? PromotionDays { get; set; }
    public string? S3ObjectUrl { get; set; }
    public bool IsActive { get; set; }
}
