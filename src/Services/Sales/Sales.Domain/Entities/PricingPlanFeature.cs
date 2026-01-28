namespace Sales.Domain.Entities;

[Table("PricingPlanFeature", Schema = "Sales")]
public class PricingPlanFeature : BaseEntity
{
    public required PricingPlan PricingPlan { get; set; }
    public int PricingPlanId { get; set; }

    /// <summary>
    /// FK to Config.Aplicacion - navigation removed for cross-service boundary
    /// </summary>
    public int ApplicationId { get; set; }

    // ✅ NUEVO: Paquete de consumo asociado
    public ConsumptionPackage? ConsumptionPackage { get; set; }
    public int? ConsumptionPackageId { get; set; }

    // Configuración de la Característica
    public int Quantity { get; set; } = 1;
    public bool IsRequired { get; set; } = true;
    public bool IsAddOn { get; set; } = false; // true = módulo adicional

    // ✅ NUEVO: Configuración de consumo
    public bool IsConsumptionBased { get; set; } = false;
    public string? ConsumptionType { get; set; } // "invoice", "product", "user", "storage"
    public int? ConsumptionLimit { get; set; }
    public decimal? ConsumptionPrice { get; set; }
    public string? ConsumptionResetPeriod { get; set; } // "monthly", "yearly", "never"

    // ✅ NUEVO: Límites y restricciones
    public int? MaxQuantity { get; set; }
    public bool AllowOverage { get; set; } = false;
    public decimal? OverageRate { get; set; }
    public int? OverageLimit { get; set; }

    [MaxLength(500)] public string? Description { get; set; }

    // Relaciones
    public ICollection<FeaturePolicyConfiguration> FeaturePolicyConfigurations { get; set; } = new List<FeaturePolicyConfiguration>();
    public ICollection<SubscriptionFeature> SubscriptionFeatures { get; set; } = new List<SubscriptionFeature>();
    public ICollection<FeatureUsage> FeatureUsages { get; set; } = new List<FeatureUsage>();
    public ICollection<ConsumptionTracking> ConsumptionTrackings { get; set; } = new List<ConsumptionTracking>();

    // ✅ PROPIEDADES CALCULADAS
    public decimal EffectivePrice => OverridePrice ?? PricingPlan.BasePrice;
    public bool IsUnlimited => !IsConsumptionBased || ConsumptionLimit == -1;
    public bool HasOverage => AllowOverage && OverageRate.HasValue;
    public bool IsCore => IsRequired && !IsAddOn;

    // ✅ NUEVO: Propiedades de consumo heredadas del paquete
    public int? PackageQuantity => ConsumptionPackage?.Quantity;
    public string? PackageUnit => ConsumptionPackage?.Unit;
    public string? PackageDisplayName => ConsumptionPackage?.DisplayName;
    public bool HasConsumptionPackage => ConsumptionPackage != null;
    public bool IsPackageUnlimited => ConsumptionPackage?.IsUnlimited == true;

    // Note: Application details (Code, Name) must be fetched via ApplicationId from Config service
    // Navigation removed for cross-service boundary

    // ✅ NUEVO: Propiedades de override
    public decimal? OverridePrice { get; set; }
    public decimal? OverrideTaxRate { get; set; }

    // ✅ NUEVO: Métodos de consumo
    public bool CanConsume(int quantity = 1)
    {
        if (!IsConsumptionBased) return true;
        if (IsUnlimited) return true;

        // Verificar límite del paquete si existe
        if (HasConsumptionPackage && !IsPackageUnlimited)
        {
            var totalLimit = ConsumptionPackage!.Quantity;
            // Aquí podrías verificar el consumo actual desde ConsumptionTracking
            return true; // Simplificado por ahora
        }

        return true;
    }

    public decimal CalculateConsumptionCost(int quantity)
    {
        if (!IsConsumptionBased) return 0;

        var baseCost = ConsumptionPrice ?? EffectivePrice;
        var totalCost = baseCost * quantity;

        // Aplicar descuentos del paquete si existe
        if (HasConsumptionPackage && ConsumptionPackage!.DiscountRate.HasValue)
        {
            totalCost *= (1 - ConsumptionPackage.DiscountRate.Value / 100);
        }

        return totalCost;
    }
}
