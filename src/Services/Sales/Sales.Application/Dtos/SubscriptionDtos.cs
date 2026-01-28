namespace Sales.Application.Dtos;

/// <summary>
/// DTO for creating a new subscription
/// </summary>
public class CreateSubscriptionRequest
{
    public int PricingPlanId { get; set; }
    public int CompanyId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? MaxPaymentDate { get; set; }

    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }

    public bool? Paid { get; set; } = false;
    public string? WarningMessage { get; set; }

    public bool IsTrial { get; set; } = false;
    public DateTime? TrialExpiresAt { get; set; }
    public bool AutoRenew { get; set; } = true;

    public bool IsConsumptionBased { get; set; } = false;
    public bool AllowOverage { get; set; } = false;
    public decimal? OverageBudget { get; set; }

    public ICollection<CreateSubscriptionFeatureRequest> Features { get; set; } = [];
}

/// <summary>
/// DTO for updating an existing subscription
/// </summary>
public class UpdateSubscriptionRequest
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? MaxPaymentDate { get; set; }

    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }

    public bool? Paid { get; set; }
    public string? WarningMessage { get; set; }

    public bool? IsTrial { get; set; }
    public DateTime? TrialExpiresAt { get; set; }
    public bool? AutoRenew { get; set; }

    public bool? IsConsumptionBased { get; set; }
    public bool? AllowOverage { get; set; }
    public decimal? OverageBudget { get; set; }
}

/// <summary>
/// DTO for subscription response
/// </summary>
public class SubscriptionResponse
{
    public int Id { get; set; }
    public int PricingPlanId { get; set; }
    public int CompanyId { get; set; }

    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? MaxPaymentDate { get; set; }

    public decimal? Cost { get; set; }
    public decimal? Tax { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Total { get; set; }

    public bool? Paid { get; set; }
    public string? WarningMessage { get; set; }

    public bool IsTrial { get; set; }
    public DateTime? TrialExpiresAt { get; set; }
    public bool AutoRenew { get; set; }
    public int TrialExtensionsUsed { get; set; }

    public bool IsConsumptionBased { get; set; }
    public bool AllowOverage { get; set; }
    public decimal? OverageBudget { get; set; }
    public decimal? TotalOverageCost { get; set; }

    // Renewal & Plan Change History
    public int RenewalCount { get; set; }
    public DateTime? LastRenewalDate { get; set; }
    public DateTime? NextRenewalDate { get; set; }
    public string? RenewalReason { get; set; }

    public int? PreviousPricingPlanId { get; set; }
    public DateTime? PlanChangeDate { get; set; }
    public string? PlanChangeReason { get; set; }

    // Audit
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public int? CreatedByUserId { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? UpdatedAt { get; set; }

    // Related Data
    public string? PricingPlanName { get; set; }
    public string? CompanyName { get; set; }

    public ICollection<SubscriptionFeatureResponse> Features { get; set; } = [];
}

/// <summary>
/// DTO for subscription feature request
/// </summary>
public class CreateSubscriptionFeatureRequest
{
    public int PricingPlanFeatureId { get; set; }
    public int Quantity { get; set; } = 1;
    public DateTime? ActivatedAt { get; set; }
    public DateTime? DeactivatedAt { get; set; }

    public decimal? OverrideCost { get; set; }
    public decimal? OverrideTax { get; set; }
    public decimal? OverrideDiscount { get; set; }
    public decimal? OverrideTotal { get; set; }

    public string? Notes { get; set; }
}

/// <summary>
/// DTO for subscription feature response
/// </summary>
public class SubscriptionFeatureResponse
{
    public int Id { get; set; }
    public int SubscriptionId { get; set; }
    public int PricingPlanFeatureId { get; set; }

    public int Quantity { get; set; }
    public DateTime? ActivatedAt { get; set; }
    public DateTime? DeactivatedAt { get; set; }

    public decimal? OverrideCost { get; set; }
    public decimal? OverrideTax { get; set; }
    public decimal? OverrideDiscount { get; set; }
    public decimal? OverrideTotal { get; set; }

    public int? ConsumptionLimit { get; set; }
    public int? CurrentConsumption { get; set; }
    public DateTime? ConsumptionResetDate { get; set; }
    public int? OverageQuantity { get; set; }
    public decimal? OverageCost { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; }
    public string CreatedAt { get; set; } = string.Empty;

    // Related Data
    public string? ApplicationName { get; set; }
    public int? ApplicationId { get; set; }

    public ICollection<FeatureUsageResponse> FeatureUsages { get; set; } = [];
}

/// <summary>
/// DTO for feature usage tracking
/// </summary>
public class FeatureUsageResponse
{
    public int Id { get; set; }
    public int SubscriptionFeatureId { get; set; }

    public int UsageCount { get; set; }
    public DateTime UsageDate { get; set; }

    public string? Context { get; set; }
    public string? Metadata { get; set; }

    public string CreatedAt { get; set; } = string.Empty;
}

/// <summary>
/// DTO for list response with pagination
/// </summary>
public class SubscriptionListResponse
{
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public ICollection<SubscriptionResponse> Items { get; set; } = [];
}
