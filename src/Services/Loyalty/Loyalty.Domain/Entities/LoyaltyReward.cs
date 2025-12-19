using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyReward : BaseEntity
{
    public int CompanyCustomerId { get; set; }
    // public virtual CompanyCustomer CompanyCustomer { get; set; }

    public int? LoyaltyTransactionId { get; set; }
    public virtual LoyaltyTransaction? LoyaltyTransaction { get; set; }

    public int? LoyaltyTierBenefitId { get; set; }
    public LoyaltyTierBenefit? LoyaltyTierBenefit { get; set; }

    [MaxLength(100)] public required string RewardName { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    public RewardType RewardType { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal RewardValue { get; set; }

    public DateTime EarnedDate { get; set; }
    public DateTime? UsedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public RewardStatus Status { get; set; }

    // Usage tracking
    [MaxLength(50)] public string? UsedInModule { get; set; }
    [MaxLength(50)] public string? UsedInTransactionId { get; set; }
}
