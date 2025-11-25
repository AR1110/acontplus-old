using Loyalty.Domain.Enums;

namespace Loyalty.Application.Models;

public class RewardApplicationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; }
    public decimal RewardValue { get; set; }
    public RewardType RewardType { get; set; }
    public string Description { get; set; }
}
