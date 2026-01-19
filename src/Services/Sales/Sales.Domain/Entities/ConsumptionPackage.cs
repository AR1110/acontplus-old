namespace Sales.Domain.Entities;

[Table("ConsumptionPackage", Schema = "Sales")]
public class ConsumptionPackage : BaseEntity
{
    [Required][MaxLength(50)] public required string Name { get; set; } // "100 Facturas", "50 Productos"
    [Required][MaxLength(25)] public required string Code { get; set; } // "INV_100", "PROD_50"
    [MaxLength(500)] public string? Description { get; set; }

    // ✅ CONFIGURACIÓN DEL PAQUETE
    public string ConsumptionType { get; set; } = string.Empty; // "invoice", "product", "user", "storage", "report"
    public int Quantity { get; set; } // 100, 50, etc.
    public string Unit { get; set; } = string.Empty; // "facturas", "productos", "usuarios", "GB"

    // ✅ PRECIOS Y COSTOS
    [Column(TypeName = "numeric(18,5)")] public decimal BasePrice { get; set; }
    [Column(TypeName = "numeric(18,5)")] public decimal? OverageRate { get; set; } // Precio por unidad adicional
    [Column(TypeName = "numeric(5,2)")] public decimal? DiscountRate { get; set; }

    // ✅ CONFIGURACIÓN DE OVERAGE
    public bool AllowOverage { get; set; } = false;
    public int? OverageLimit { get; set; }
    public decimal? OverageBudget { get; set; } // Presupuesto máximo para overage

    // ✅ PERIODO Y RESET
    public string ResetPeriod { get; set; } = "monthly"; // "monthly", "quarterly", "yearly", "never"
    public bool AutoReset { get; set; } = true;
    public int? GracePeriodDays { get; set; } // Días de gracia después del límite

    // ✅ RESTRICCIONES

    public bool IsAddOn { get; set; } = false; // true = paquete adicional
    public bool IsRequired { get; set; } = false; // true = paquete obligatorio

    // ✅ APLICACIONES COMPATIBLES (IDs only, navigation removed for cross-service boundary)
    // Use a join table or store ApplicationIds as JSON/comma-separated if needed
    public ICollection<PricingPlanFeature> PricingPlanFeatures { get; set; } = new List<PricingPlanFeature>();

    // ✅ PROPIEDADES CALCULADAS
    public decimal EffectivePrice => BasePrice * (1 - (DiscountRate ?? 0) / 100);
    public bool HasOverage => AllowOverage && OverageRate.HasValue;
    public bool IsUnlimited => Quantity == -1;
    public string DisplayName => $"{Quantity} {Unit}";

    public decimal CalculateOverageCost(int overageQuantity)
    {
        if (!HasOverage || overageQuantity <= 0) return 0;
        return overageQuantity * OverageRate!.Value;
    }

    public bool IsCompatibleWithApplication(int applicationId)
    {
        // Note: CompatibleApplications navigation removed for cross-service boundary
        // This check should be done via a join table query in the application layer
        // using ApplicationIds stored in a separate ConsumptionPackageApplication table
        throw new NotImplementedException("Use application layer to check compatibility via ApplicationId");
    }

    public string GetResetDescription()
    {
        return ResetPeriod switch
        {
            "monthly" => "Mensual",
            "quarterly" => "Trimestral",
            "yearly" => "Anual",
            "never" => "Sin reset",
            _ => ResetPeriod
        };
    }
}
