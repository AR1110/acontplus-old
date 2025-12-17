using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyRule : CompanyEntity
{
    public int LoyaltyProgramId { get; set; }
    public required LoyaltyProgram LoyaltyProgram { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    public LoyaltyRuleType RuleType { get; set; }

    // Rule trigger conditions (JSON)
    [Column(TypeName = "nvarchar(max)")]
    public required string TriggerConditions { get; set; }

    // Rule actions (JSON)
    [Column(TypeName = "nvarchar(max)")]
    public required string Actions { get; set; }

    public int Priority { get; set; } // Higher number = higher priority

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
