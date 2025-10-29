namespace Restaurant.Domain.Entities.MealManagement;

public class DailyMenu: BaseEntity
{
    public int EstablishmentId { get; set; }

    public DateTime MenuDate { get; set; }

    public int MealScheduleSettingId { get; set; }

    [MaxLength(1000)]
    public string Description { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal StandardPrice { get; set; }

    public bool IsAvailable { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public MealScheduleSettings MealSchedule { get; set; }
}
