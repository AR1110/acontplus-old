namespace Sales.Domain.Entities;

[Table("SubscriptionFeature", Schema = "Sales")]
public class SubscriptionFeature : BaseEntity
{
    public Subscription Subscription { get; set; } = null!;
    public int SubscriptionId { get; set; }

    // ✅ CAMBIO: Usar PricingPlanFeature en lugar de Application directamente
    public PricingPlanFeature PricingPlanFeature { get; set; } = null!;
    public int PricingPlanFeatureId { get; set; }

    // Configuración
    public int Quantity { get; set; } = 1;


    // Fechas de Activación
    public DateTime? ActivatedAt { get; set; }
    public DateTime? DeactivatedAt { get; set; }

    // Precios Personalizados (override del PricingPlanFeature)
    [Column(TypeName = "numeric(18,5)")] public decimal? OverrideCost { get; set; }
    [Column(TypeName = "numeric(18,5)")] public decimal? OverrideTax { get; set; }
    [Column(TypeName = "numeric(18,5)")] public decimal? OverrideDiscount { get; set; }
    [Column(TypeName = "numeric(18,5)")] public decimal? OverrideTotal { get; set; }

    // ✅ NUEVO: Consumo (heredado del PricingPlanFeature)
    public int? ConsumptionLimit { get; set; }
    public int? CurrentConsumption { get; set; }
    public DateTime? ConsumptionResetDate { get; set; }
    public int? OverageQuantity { get; set; }
    public decimal? OverageCost { get; set; }

    // ✅ NUEVO: Seguimiento de consumo por usuario
    public ICollection<ConsumptionTracking> ConsumptionTrackings { get; set; } = new List<ConsumptionTracking>();

    [MaxLength(500)] public string? Notes { get; set; }

    // Relaciones
    public ICollection<FeatureUsage> FeatureUsages { get; set; } = new List<FeatureUsage>();

    // Note: Application details must be fetched via PricingPlanFeature.ApplicationId from Config service
    // Navigation properties removed for cross-service boundary
    public int GetApplicationId => PricingPlanFeature?.ApplicationId ?? 0;

    public decimal EffectiveCost => OverrideCost ?? PricingPlanFeature.EffectivePrice;
    public decimal EffectiveTaxRate => PricingPlanFeature.OverrideTaxRate ?? 0;
    public decimal EffectiveDiscount => OverrideDiscount ?? 0;

    public bool IsConsumptionBased => PricingPlanFeature.IsConsumptionBased;
    public string? ConsumptionType => PricingPlanFeature.ConsumptionType;
    public bool IsAddOn => PricingPlanFeature.IsAddOn;
    public bool IsRequired => PricingPlanFeature.IsRequired;
    public bool IsCore => PricingPlanFeature.IsCore;

    // ✅ NUEVO: Propiedades de consumo del paquete
    public int? PackageQuantity => PricingPlanFeature.PackageQuantity;
    public string? PackageUnit => PricingPlanFeature.PackageUnit;
    public string? PackageDisplayName => PricingPlanFeature.PackageDisplayName;
    public bool HasConsumptionPackage => PricingPlanFeature.HasConsumptionPackage;
    public bool IsPackageUnlimited => PricingPlanFeature.IsPackageUnlimited;

    public int RemainingConsumption => ConsumptionLimit.HasValue && CurrentConsumption.HasValue
        ? Math.Max(0, ConsumptionLimit.Value - CurrentConsumption.Value)
        : 0;

    public bool IsConsumptionLimitReached => ConsumptionLimit.HasValue && CurrentConsumption.HasValue
                                                                       && CurrentConsumption.Value >=
                                                                       ConsumptionLimit.Value;

    public bool IsNearLimit => ConsumptionLimit.HasValue && CurrentConsumption.HasValue
                                                         && CurrentConsumption.Value >=
                                                         (int)(ConsumptionLimit.Value * 0.8);

    public bool HasOverage => OverageQuantity > 0;
    public decimal TotalOverageCost => OverageCost ?? 0;

    // ✅ NUEVO: Métodos de consumo
    public bool CanConsume(int quantity = 1)
    {
        if (!IsConsumptionBased) return true;
        if (IsPackageUnlimited) return true;

        var totalLimit = ConsumptionLimit ?? PackageQuantity ?? 0;
        if (totalLimit == 0) return true; // Sin límite

        return (CurrentConsumption ?? 0) + quantity <= totalLimit;
    }

    public void Consume(int quantity = 1)
    {
        if (!IsConsumptionBased) return;

        CurrentConsumption = (CurrentConsumption ?? 0) + quantity;

        // Verificar si se excedió el límite
        var totalLimit = ConsumptionLimit ?? PackageQuantity ?? 0;
        if (totalLimit > 0 && CurrentConsumption > totalLimit)
        {
            var overage = CurrentConsumption.Value - totalLimit;
            OverageQuantity = overage;

            // Calcular costo de overage si existe
            if (PricingPlanFeature.OverageRate.HasValue)
            {
                OverageCost = overage * PricingPlanFeature.OverageRate.Value;
            }
        }
    }

    public void ResetConsumption()
    {
        CurrentConsumption = 0;
        OverageQuantity = 0;
        OverageCost = 0;
        ConsumptionResetDate = DateTime.UtcNow;
    }

    public string GetConsumptionStatus()
    {
        if (!IsConsumptionBased) return "Sin límite de consumo";

        var totalLimit = ConsumptionLimit ?? PackageQuantity ?? 0;
        if (totalLimit == 0) return "Sin límite de consumo";

        var current = CurrentConsumption ?? 0;
        var remaining = Math.Max(0, totalLimit - current);

        if (HasOverage)
        {
            return $"Uso: {current}/{totalLimit} + {OverageQuantity} overage";
        }

        if (IsNearLimit)
        {
            return $"Uso: {current}/{totalLimit} - ¡Cerca del límite!";
        }

        return $"Uso: {current}/{totalLimit} - Restante: {remaining}";
    }
}
