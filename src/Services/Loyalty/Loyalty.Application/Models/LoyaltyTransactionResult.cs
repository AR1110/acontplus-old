namespace Loyalty.Application.Models;

public class LoyaltyTransactionResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public int TransactionId { get; set; }
    public int PointsEarned { get; set; }
    public int NewPointsBalance { get; set; }
    public bool TierChanged { get; set; }
    public string? NewTier { get; set; }
    public List<string> NewTierBenefits { get; set; } = [];
}
