namespace Loyalty.Domain.Enums;

public enum BusinessType
{
    Barbershop = 1,
    Restaurant = 2,
    Spa = 3,
    Retail = 4,
    Salon = 5,
    Gym = 6,
    Hotel = 7,
    Other = 99
}

public enum LoyaltyProgramType
{
    Points = 1,
    Visits = 2,
    Spending = 3,
    Hybrid = 4
}

public enum PointsCalculationType
{
    PerDollar = 1,
    PerTransaction = 2,
    PerItem = 3,
    PerVisit = 4,
    Custom = 5
}

public enum BenefitType
{
    DiscountPercentage = 1,
    DiscountAmount = 2,
    FreeItem = 3,
    PointsMultiplier = 4,
    PriorityService = 5,
    Custom = 6
}

public enum BenefitPeriod
{
    Daily = 1,
    Weekly = 2,
    Monthly = 3,
    Quarterly = 4,
    Yearly = 5
}

public enum LoyaltyRuleType
{
    PointsEarning = 1,
    TierUpgrade = 2,
    BirthdayReward = 3,
    SpecialPromotion = 4,
    Custom = 5
}

public enum LoyaltyTransactionType
{
    Purchase = 1,
    Return = 2,
    PointsAdjustment = 3,
    RewardRedemption = 4,
    BirthdayBonus = 5,
    TierUpgrade = 6,
    Referral = 7
}

public enum RewardType
{
    Discount = 1,
    FreeService = 2,
    FreeProduct = 3,
    Points = 4,
    Cashback = 5,
    Custom = 6
}

public enum RewardStatus
{
    Available = 1,
    Used = 2,
    Expired = 3,
    Cancelled = 4
}

public enum LoyaltyAlertType
{
    Birthday = 1,
    TierUpgrade = 2,
    AvailableRewards = 3,
    PointsExpiring = 4,
    SpecialOffer = 5
}

public enum AlertPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}
