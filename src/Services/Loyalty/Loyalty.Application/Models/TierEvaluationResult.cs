namespace Loyalty.Application.Models;

public class TierEvaluationResult
{
    public bool Success { get; set; }
    public bool TierChanged { get; set; }
    public string PreviousTier { get; set; }
    public string NewTier { get; set; }
    public List<string> NewTierBenefits { get; set; } = [];
}
