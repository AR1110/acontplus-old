namespace Sales.Domain.Entities;

[Table("Subscription", Schema = "Sales")]
public class Subscription : BaseEntity
{
    public required PricingPlan PricingPlan { get; set; }
    public int PricingPlanId { get; set; }

    public Company Company { get; set; } = null!;
    public int CompanyId { get; set; }

    // Fechas
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime MaxPaymentDate { get; set; }

    // ✅ NUEVO: Historial de renovaciones
    public int RenewalCount { get; set; } = 0;
    public DateTime? LastRenewalDate { get; set; }
    public DateTime? NextRenewalDate { get; set; }
    public string? RenewalReason { get; set; } // "auto", "manual", "plan_change"

    // ✅ NUEVO: Historial de cambios de plan
    public int? PreviousPricingPlanId { get; set; }
    public PricingPlan? PreviousPricingPlan { get; set; }
    public DateTime? PlanChangeDate { get; set; }
    public string? PlanChangeReason { get; set; }

    // Información de Pago
    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Cost { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Tax { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "numeric(18,5), null")]
    public decimal? Total { get; set; }

    public bool? Paid { get; set; }

    // ✅ ESTADO Y CONFIGURACIÓN

    public bool IsTrial { get; set; } = false;
    public DateTime? TrialExpiresAt { get; set; }
    public bool AutoRenew { get; set; } = true;
    public int TrialExtensionsUsed { get; set; } = 0;

    // Configuración de Consumo
    public bool IsConsumptionBased { get; set; } = false;
    public bool AllowOverage { get; set; } = false;
    public decimal? OverageBudget { get; set; }
    public decimal? TotalOverageCost { get; set; }

    [MaxLength(1500)] public string? WarningMessage { get; set; }

    // Relaciones
    public ICollection<SubscriptionFeature> SubscriptionFeatures { get; set; } = new List<SubscriptionFeature>();
    public ICollection<FeatureUsage> FeatureUsages { get; set; } = new List<FeatureUsage>();

    public ICollection<SubscriptionRenewalHistory> RenewalHistory { get; set; } =
        new List<SubscriptionRenewalHistory>();

    public ICollection<SubscriptionPlanChangeHistory> PlanChangeHistory { get; set; } =
        new List<SubscriptionPlanChangeHistory>();

    // Propiedades Calculadas
    public decimal CalculatedTotal => PricingPlan != null
        ? PricingPlan.BasePrice * (1 + (PricingPlan.TaxRate ?? 0) / 100) * (1 - (PricingPlan.DiscountRate ?? 0) / 100)
        : Total ?? 0;

    public bool IsTrialExpired => IsTrial && TrialExpiresAt.HasValue && DateTime.UtcNow > TrialExpiresAt.Value;
    public int DaysUntilExpiration => (EndDate - DateTime.UtcNow).Days;

    public bool CanExtendTrial => IsTrial && PricingPlan?.CanExtendTrial == true &&
                                  TrialExtensionsUsed < (PricingPlan.MaxTrialExtensions ?? 0);

    public bool IsNearExpiration => DaysUntilExpiration <= 30 && DaysUntilExpiration > 0;
    public bool IsExpired => DateTime.UtcNow > EndDate;

    // Métodos Útiles
    public bool HasFeature(string applicationCode)
    {
        return SubscriptionFeatures.Any(sf =>
            sf.PricingPlanFeature.Application.Code == applicationCode &&
            sf.IsActive);
    }

    public SubscriptionFeature? GetFeature(string applicationCode)
    {
        return SubscriptionFeatures.FirstOrDefault(sf =>
            sf.PricingPlanFeature.Application.Code == applicationCode);
    }

    public bool IsFeatureActive(string applicationCode)
    {
        var feature = GetFeature(applicationCode);
        return feature?.IsActive == true;
    }

    public decimal GetFeaturePrice(string applicationCode)
    {
        var feature = GetFeature(applicationCode);
        return feature?.EffectiveCost ?? 0;
    }

    // ✅ NUEVO: Métodos de renovación
    public void Renew(DateTime newEndDate, string reason = "auto")
    {
        var oldEndDate = EndDate;
        EndDate = newEndDate;
        LastRenewalDate = DateTime.UtcNow;
        NextRenewalDate = newEndDate;
        RenewalCount++;
        RenewalReason = reason;

        // Guardar información para el historial
        LastRenewalOldEndDate = oldEndDate;
        LastRenewalNewEndDate = newEndDate;
        LastRenewalReason = reason;
    }

    public void ChangePlan(int newPricingPlanId, string reason = "plan_change")
    {
        PreviousPricingPlanId = PricingPlanId;
        PlanChangeDate = DateTime.UtcNow;
        PlanChangeReason = reason;
        PricingPlanId = newPricingPlanId;

        // Guardar información para el historial
        LastPlanChangeOldPricingPlanId = PreviousPricingPlanId;
        LastPlanChangeNewPricingPlanId = newPricingPlanId;
        LastPlanChangeReason = reason;
    }

    // ✅ NUEVO: Propiedades para facilitar la creación de historial
    public DateTime? LastRenewalOldEndDate { get; private set; }
    public DateTime? LastRenewalNewEndDate { get; private set; }
    public string? LastRenewalReason { get; private set; }

    public int? LastPlanChangeOldPricingPlanId { get; private set; }
    public int? LastPlanChangeNewPricingPlanId { get; private set; }
    public string? LastPlanChangeReason { get; private set; }
}