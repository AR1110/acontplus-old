namespace Configuration.Domain.Entities;

[Table("SubscriptionType", Schema = "Config")]
public class SubscriptionType : BaseEntity
{
    [MaxLength(5)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    public int? Quantity { get; set; }
    public int? Duration { get; set; }
}
