namespace Restaurant.Domain.Entities;

[Table("Order", Schema = "Restaurant")]
public class Order : BaseEntity
{
    public int PuntoEmisionId { get; set; }
    public AppTable? AppTable { get; set; }
    public int? TableId { get; set; }
    public int Sequence { get; set; }
    [MaxLength(18)] public required string Serie { get; set; }
    public int CustomerCompanyId { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal? Discount { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal? Tip { get; set; }
    [Column(TypeName = "decimal(18,5)")] public decimal Total { get; set; }
    [MaxLength(500)] public string? Obs { get; set; }
    public bool IsDivided { get; set; }
    public bool IsFinished { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = []; //Legacy property, may be removed in future
    public ICollection<OrderDetail> OrderDetails { get; set; } = [];
    public ICollection<MealManagement.MealConsumption> MealConsumptions { get; set; } = [];
}
