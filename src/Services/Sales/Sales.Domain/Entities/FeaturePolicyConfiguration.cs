namespace Sales.Domain.Entities;

[Table("FeaturePolicyConfiguration", Schema = "Sales")]
public class FeaturePolicyConfiguration : BaseEntity
{
    public PricingPlanFeature PricingPlanFeature { get; set; } = null!;
    public int PricingPlanFeatureId { get; set; }

    public PolicyType PolicyType { get; set; } = null!;
    public int PolicyTypeId { get; set; }

    // ✅ NUEVO: Configuración de políticas de consumo
    public string? ConsumptionPolicy { get; set; } // "strict", "warning", "grace_period"
    public int? ConsumptionLimit { get; set; }
    public int? WarningThreshold { get; set; } // Porcentaje para mostrar advertencia
    public int? GracePeriodDays { get; set; } // Días de gracia después del límite

    // ✅ NUEVO: Configuración de políticas de acceso
    public bool IsAccessRestricted { get; set; } = false;
    public string? AccessRestrictionType { get; set; } // "time_limit", "feature_limit", "data_limit"
    public DateTime? AccessExpiresAt { get; set; }
    public int? MaxDataSize { get; set; } // En MB o GB

    // ✅ NUEVO: Configuración de políticas de facturación
    public bool IsBillingEnabled { get; set; } = true;
    public decimal? BillingThreshold { get; set; }
    public string? BillingFrequency { get; set; } // "monthly", "quarterly", "yearly"

    [MaxLength(500)] public string? Description { get; set; }

    // Relaciones
    public ICollection<FeaturePolicyAccess> FeaturePolicyAccesses { get; set; } = new List<FeaturePolicyAccess>();

    // ✅ PROPIEDADES CALCULADAS
    public bool HasConsumptionLimit => ConsumptionLimit is > 0;
    public bool HasWarningThreshkold => WarningThreshold is > 0;
    public bool HasGracePeriod => GracePeriodDays is > 0;
    public bool IsAccessExpired => AccessExpiresAt.HasValue && DateTime.UtcNow > AccessExpiresAt.Value;

    public int WarningLimit => ConsumptionLimit.HasValue && WarningThreshold.HasValue
        ? (int)(ConsumptionLimit.Value * (WarningThreshold.Value / 100.0))
        : 0;
}