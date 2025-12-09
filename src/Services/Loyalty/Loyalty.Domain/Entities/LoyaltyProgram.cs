using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyProgram : CompanyEntity
{
    [Required][MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    public LoyaltyProgramType ProgramType { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // Birthday rewards configuration
    public bool BirthdayRewardsEnabled { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal? BirthdayDiscountPercentage { get; set; }
    [Column(TypeName = "decimal(18,2)")] public decimal? BirthdayDiscountMaxAmount { get; set; }
    public int BirthdayValidityDays { get; set; } = 7;

    // Points configuration
    public bool PointsEnabled { get; set; }

    [Column(TypeName = "decimal(18,4)")]
    public decimal PointsPerUnit { get; set; } // Points per dollar/transaction/etc.

    public PointsCalculationType PointsCalculationType { get; set; }

    // Navigation properties
    public virtual ICollection<LoyaltyTier>? Tiers { get; set; }
    public virtual ICollection<LoyaltyRule>? Rules { get; set; }
}