namespace Sales.Domain.Entities;

[Table("Coupon", Schema = "Sales")]
public class Coupon : BaseEntity
{
    [MaxLength(100)] public required string Code { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Percent { get; set; }

    public DateTime ExpiryDate { get; set; }
}
