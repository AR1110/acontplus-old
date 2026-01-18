namespace Sales.Domain.Entities;

[Table("FeatureUsage", Schema = "Sales")]
public class FeatureUsage : BaseEntity
{
    public SubscriptionFeature SubscriptionFeature { get; set; } = null!;
    public int SubscriptionFeatureId { get; set; }

    /// <summary>
    /// FK to Identity.AppUser - navigation removed for cross-service boundary
    /// </summary>
    public int UserId { get; set; }

    // ✅ NUEVO: Información del uso
    public string UsageType { get; set; } = string.Empty; // "create", "read", "update", "delete", "export"
    public string EntityType { get; set; } = string.Empty; // "invoice", "product", "customer", "report"
    public string? EntityId { get; set; } // ID de la entidad específica

    // ✅ NUEVO: Métricas de consumo
    public int Quantity { get; set; } = 1;
    public decimal? DataSize { get; set; } // En MB o GB
    public int? ProcessingTime { get; set; } // En milisegundos

    // ✅ NUEVO: Validación de políticas
    public bool IsPolicyCompliant { get; set; } = true;
    public string? PolicyViolationReason { get; set; }
    public bool IsOverage { get; set; } = false;
    public decimal? OverageCost { get; set; }

    // ✅ NUEVO: Información de contexto
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Location { get; set; }

    [MaxLength(500)] public string? Notes { get; set; }

    // Note: Application details must be fetched via SubscriptionFeature.PricingPlanFeature.ApplicationId
    // Navigation properties removed for cross-service boundary
    public int GetApplicationId => SubscriptionFeature?.PricingPlanFeature?.ApplicationId ?? 0;

    public bool IsConsumptionBased => SubscriptionFeature.IsConsumptionBased;
    public string? ConsumptionType => SubscriptionFeature.ConsumptionType;
    public int RemainingConsumption => SubscriptionFeature.RemainingConsumption;

    public bool IsLimitReached => SubscriptionFeature.IsConsumptionLimitReached;
    public bool IsNearLimit => SubscriptionFeature.IsNearLimit;
    public bool HasOverage => SubscriptionFeature.HasOverage;

    // ✅ MÉTODOS ÚTILES
    // Note: ValidatePolicy needs to be reimplemented using PolicyTypeId lookup
    // PolicyType navigation removed for cross-service boundary
    public bool ValidatePolicyByLimit()
    {
        if (SubscriptionFeature?.PricingPlanFeature?.FeaturePolicyConfigurations == null)
            return true;

        var policy = SubscriptionFeature.PricingPlanFeature.FeaturePolicyConfigurations
            .FirstOrDefault(fpc => fpc.HasConsumptionLimit);

        if (policy == null) return true;

        if (policy.HasConsumptionLimit &&
            SubscriptionFeature.CurrentConsumption >= policy.ConsumptionLimit)
        {
            IsPolicyCompliant = false;
            PolicyViolationReason = "Consumption limit reached";
            return false;
        }

        return true;
    }

    public void CalculateOverage()
    {
        if (!IsPolicyCompliant && SubscriptionFeature?.HasOverage == true)
        {
            // Note: PolicyType check by code removed - use PolicyTypeId or check directly
            if (SubscriptionFeature.PricingPlanFeature?.OverageRate.HasValue == true)
            {
                IsOverage = true;
                OverageCost = Quantity * SubscriptionFeature.PricingPlanFeature.OverageRate.Value;
            }
        }
    }
}
