using Loyalty.Domain.Enums;

namespace Loyalty.Application.Models;

public class AvailableBenefit
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public BenefitType BenefitType { get; set; }
    public decimal Value { get; set; }
    public decimal? MaxValue { get; set; }
    public int Priority { get; set; }
    public bool IsBirthdayReward { get; set; }
    public string Conditions { get; set; }
}
