namespace Restaurant.Domain.Entities;

[Table("Promotion", Schema = "Restaurant")]
public class Promotion : BaseEntity
{
    [Required] public int EstablishmentId { get; set; }

    [Required][MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    [Required] public DateTime StartDate { get; set; }

    [Required] public DateTime EndDate { get; set; }

    public string? ApplicableDays { get; set; }

    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }

    public PromotionType Type { get; set; }

    [Column(TypeName = "decimal(5,2)")] public decimal? DiscountPercent { get; set; }

    public int? MaxUsesPerCustomer { get; set; }
    public int? MaxTotalUses { get; set; }
    public int CurrentUses { get; set; }

    [MaxLength(800)] public string? ImageUrl { get; set; }

    [MaxLength(500)] public string? ImageKey { get; set; }

    public ICollection<PromotionDetail> PromotionDetails { get; set; } = [];
}

public enum PromotionType
{
    Discount = 1,
    BuyXGetY = 2,
    Combo = 3,
    FreeItem = 4,
    FixedPrice = 5
}
