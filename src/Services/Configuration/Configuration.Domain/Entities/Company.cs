namespace Configuration.Domain.Entities;

[Table("Company", Schema = "Config")]
public class Company : BaseEntity
{
    public Guid Uuid { get; set; }

    [MaxLength(15)] public required string IdCard { get; set; }

    [MaxLength(300)] public required string BusinessName { get; set; }

    [MaxLength(300)] public string? TradeName { get; set; }

    [MaxLength(300)] public string? Email { get; set; }

    [MaxLength(100)] public string? Telephone { get; set; }

    [MaxLength(300)] public string? Address { get; set; }
    public ICollection<WhatsAppUsage> WhatsAppUsages { get; set; } = [];
}