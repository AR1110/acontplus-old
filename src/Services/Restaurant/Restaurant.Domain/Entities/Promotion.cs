namespace Restaurant.Domain.Entities;

[Table("Promotion", Schema = "Restaurant")]
public class Promotion : BaseEntity
{
    public int EstablishmentId { get; set; }

    [Required][MaxLength(50)] public required string Description { get; set; }

    public string? PromotionDays { get; set; }

    [Required] public DateTime? StartDate { get; set; }

    [Required] public DateTime? EndDate { get; set; }

    [MaxLength(800)] public string? S3ObjectUrl { get; set; }

    [MaxLength(500)] public string? S3ObjectKey { get; set; }
}
