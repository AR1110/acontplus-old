namespace Sales.Domain.Entities;

[Table("PricingPlan", Schema = "Sales")]
public class PricingPlan : BaseEntity
{
    [Required][MaxLength(25)] public required string Code { get; set; }
    [Required][MaxLength(100)] public required string Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }

    /// <summary>
    /// FK to Config.LicenseType - navigation removed for cross-service boundary
    /// </summary>
    public int LicenseTypeId { get; set; }

    /// <summary>
    /// FK to Config.SubscriptionType - navigation removed for cross-service boundary
    /// </summary>
    public int SubscriptionTypeId { get; set; }

    [Column(TypeName = "numeric(18,5)")] public decimal BasePrice { get; set; }
    [Column(TypeName = "numeric(5,2)")] public decimal? TaxRate { get; set; }
    [Column(TypeName = "numeric(5,2)")] public decimal? DiscountRate { get; set; }

    public bool IsTrial { get; set; } = false;
    public int? TrialDays { get; set; }

    // ✅ NUEVO: Configuración avanzada de trial
    public bool RequireCreditCardForTrial { get; set; } = false;
    public bool AutoConvertToPaid { get; set; } = true;
    public int? MaxTrialExtensions { get; set; } = 0;
    public decimal? TrialExtensionCost { get; set; }

    // ✅ NUEVO: Configuración de consumo
    public bool IsConsumptionBased { get; set; } = false;
    public string? ConsumptionModel { get; set; } // "document", "product", "user", "storage"
    public bool AllowOverage { get; set; } = false;
    public decimal? OverageRate { get; set; }

    // ✅ NUEVO: Estado y configuración

    public bool IsCustomPlan { get; set; } = false;
    public int? MaxCompanies { get; set; } // Para planes multi-empresa

    public ICollection<PricingPlanFeature> PricingPlanFeatures { get; set; } = new List<PricingPlanFeature>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    // ✅ NUEVO: Propiedades Calculadas
    public decimal EffectivePrice => BasePrice * (1 - (DiscountRate ?? 0) / 100);
    public bool IsUnlimited => !IsConsumptionBased;
    public bool CanExtendTrial => MaxTrialExtensions > 0;
}
