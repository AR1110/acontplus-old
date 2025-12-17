using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyTierBenefit : BaseEntity
{
    public int LoyaltyTierId { get; set; }
    public required LoyaltyTier LoyaltyTier { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public required string Description { get; set; }

    public BenefitType BenefitType { get; set; }

    [Column(TypeName = "decimal(18,4)")] public decimal Value { get; set; } // Percentage, amount, or multiplier

    [Column(TypeName = "decimal(18,2)")] public decimal? MaxValue { get; set; }

    // Usage limitations
    public int? MaxUsagesPerPeriod { get; set; }
    public BenefitPeriod? UsagePeriod { get; set; }

    // Conditions for benefit application
    [Column(TypeName = "nvarchar(max)")] public string? Conditions { get; set; } // JSON for complex conditions
}
