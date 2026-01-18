namespace Sales.Domain.Entities;

[Table("ConsumptionTracking", Schema = "Sales")]
public class ConsumptionTracking : BaseEntity
{
    public required SubscriptionFeature SubscriptionFeature { get; set; }
    public int SubscriptionFeatureId { get; set; }

    // ✅ CONSUMO POR PAQUETES
    public string ConsumptionType { get; set; } = string.Empty; // "invoice", "product", "user", "storage", "report"
    public int PackageLimit { get; set; } // 100 facturas, 50 productos, etc.
    public int CurrentUsage { get; set; } = 0;
    public int RemainingUsage => Math.Max(0, PackageLimit - CurrentUsage);

    // ✅ PERIODO DE CONSUMO
    public string ResetPeriod { get; set; } = "monthly"; // "monthly", "quarterly", "yearly", "never"
    public DateTime? LastResetDate { get; set; }
    public DateTime? NextResetDate { get; set; }

    // ✅ CONFIGURACIÓN DE OVERAGE
    public bool AllowOverage { get; set; } = false;
    public int? OverageLimit { get; set; }
    public decimal? OverageRate { get; set; } // Precio por unidad adicional
    public int OverageUsage { get; set; } = 0;
    public decimal? OverageCost { get; set; }

    // ✅ ESTADOS Y ALERTAS
    public bool IsLimitReached => CurrentUsage >= PackageLimit;
    public bool IsNearLimit => CurrentUsage >= (int)(PackageLimit * 0.8);
    public bool IsOverageActive => AllowOverage && OverageLimit.HasValue && OverageUsage > 0;
    public bool IsOverageLimitReached => OverageLimit.HasValue && OverageUsage >= OverageLimit.Value;

    // ✅ INFORMACIÓN DE CONTEXTO
    public string? EntityType { get; set; } // Tipo de entidad que se está consumiendo
    public string? EntityId { get; set; } // ID específico de la entidad
    public DateTime UsageDate { get; set; } = DateTime.UtcNow;

    [MaxLength(500)] public string? Notes { get; set; }

    // ✅ MÉTODOS ÚTILES
    public bool CanConsume(int quantity = 1)
    {
        if (IsLimitReached && !AllowOverage) return false;
        if (IsOverageLimitReached) return false;
        return true;
    }

    public void Consume(int quantity = 1)
    {
        if (CurrentUsage < PackageLimit)
        {
            CurrentUsage += quantity;
        }
        else if (AllowOverage && OverageLimit.HasValue && OverageUsage < OverageLimit.Value)
        {
            OverageUsage += quantity;
            if (OverageRate.HasValue)
            {
                OverageCost = OverageUsage * OverageRate.Value;
            }
        }
    }

    public void ResetConsumption()
    {
        CurrentUsage = 0;
        OverageUsage = 0;
        OverageCost = 0;
        LastResetDate = DateTime.UtcNow;

        // Calcular próxima fecha de reset
        NextResetDate = ResetPeriod switch
        {
            "monthly" => DateTime.UtcNow.AddMonths(1),
            "quarterly" => DateTime.UtcNow.AddMonths(3),
            "yearly" => DateTime.UtcNow.AddYears(1),
            _ => null
        };
    }

    public decimal CalculateTotalCost()
    {
        var baseCost = SubscriptionFeature.EffectiveCost;
        var overageCost = OverageCost ?? 0;
        return baseCost + overageCost;
    }

    public string GetStatusMessage()
    {
        if (IsOverageActive)
        {
            return $"Uso: {CurrentUsage}/{PackageLimit} + {OverageUsage} overage";
        }

        if (IsNearLimit)
        {
            return $"Uso: {CurrentUsage}/{PackageLimit} - ¡Cerca del límite!";
        }

        return $"Uso: {CurrentUsage}/{PackageLimit}";
    }
}
