using System.ComponentModel.DataAnnotations.Schema;

namespace Loyalty.Domain.Entities;

public class LoyaltyTier : CompanyEntity
{
  public int LoyaltyProgramId { get; set; }
  public LoyaltyProgram LoyaltyProgram { get; set; }

  [MaxLength(100)] public required string Name { get; set; }

  [MaxLength(500)] public string? Description { get; set; }

  public int RequiredPoints { get; set; }
  public int RequiredTransactions { get; set; }

  [Column(TypeName = "decimal(18,2)")] public decimal RequiredSpending { get; set; }

  public int OrderIndex { get; set; } // For tier hierarchy

  [MaxLength(7)] public string? Color { get; set; } // For UI display

  [MaxLength(50)] public string? Icon { get; set; } // For UI display

  // Navigation properties
  public ICollection<LoyaltyTierBenefit>? Benefits { get; set; }
  // public virtual ICollection<CompanyCustomer> Customers { get; set; }
}
