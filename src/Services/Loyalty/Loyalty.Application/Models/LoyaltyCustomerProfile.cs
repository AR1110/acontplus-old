using Loyalty.Domain.Entities;

namespace Loyalty.Application.Models;

public class LoyaltyCustomerProfile
{
    public int CompanyCustomerId { get; set; }
    public required string CustomerName { get; set; }
    public DateTime? BirthDate { get; set; }
    public int TotalTransactions { get; set; }
    public int CurrentLoyaltyPoints { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal AverageTransactionValue { get; set; }
    public string? CurrentTier { get; set; }
    public DateTime FirstVisitDate { get; set; }
    public DateTime? LastVisitDate { get; set; }
    public List<AvailableBenefit> AvailableBenefits { get; set; } = [];
    public List<LoyaltyReward> ActiveRewards { get; set; } = [];
}
