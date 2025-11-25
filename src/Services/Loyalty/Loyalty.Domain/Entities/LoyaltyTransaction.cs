using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyTransaction : CompanyEntity
{
    public int CompanyCustomerId { get; set; }
    // public virtual CompanyCustomer CompanyCustomer { get; set; }

    [Required][MaxLength(50)] public required string TransactionNumber { get; set; }

    public DateTime TransactionDate { get; set; }

    public LoyaltyTransactionType TransactionType { get; set; }

    // Points tracking
    public int PointsEarned { get; set; }
    public int PointsUsed { get; set; }
    public int PointsBalance { get; set; }

    // Financial tracking
    [Column(TypeName = "decimal(18,2)")] public decimal TransactionAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal DiscountAmount { get; set; }

    // Reference to original business transaction
    [MaxLength(50)] public string? SourceModule { get; set; } // "Tickets", "Sales", "Bookings", etc.

    [MaxLength(50)] public string? SourceTransactionId { get; set; }

    // Event details (JSON for flexibility)
    [Column(TypeName = "nvarchar(max)")] public string? EventData { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    // Applied benefits
    public virtual ICollection<LoyaltyReward>? RewardsApplied { get; set; }
}