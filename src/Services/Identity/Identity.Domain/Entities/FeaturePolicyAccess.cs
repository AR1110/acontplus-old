namespace Identity.Domain.Entities;

[Table("FeaturePolicyAccess", Schema = "Access")]
public class FeaturePolicyAccess : BaseEntity
{
    /// <summary>
    /// FK to Sales.FeaturePolicyConfiguration - navigation removed for cross-service boundary
    /// </summary>
    public int FeaturePolicyConfigurationId { get; set; }

    // Configuración de Acceso
    public bool HasAccess { get; set; } = true;
    public DateTime? AccessGrantedAt { get; set; }
    public DateTime? AccessExpiresAt { get; set; }
    public string? AccessReason { get; set; } // "subscription", "trial", "admin_override"

    // ✅ NUEVO: Límites de uso específicos por usuario
    public int? UserConsumptionLimit { get; set; }
    public int? UserCurrentConsumption { get; set; }
    public DateTime? UserConsumptionResetDate { get; set; }

    // ✅ NUEVO: Restricciones de tiempo
    public TimeSpan? AllowedStartTime { get; set; }
    public TimeSpan? AllowedEndTime { get; set; }
    public bool IsTimeRestricted => AllowedStartTime.HasValue && AllowedEndTime.HasValue;

    // ✅ NUEVO: Restricciones de días
    public string? AllowedDays { get; set; } // "monday,tuesday,wednesday,thursday,friday"
    public bool IsDayRestricted => !string.IsNullOrEmpty(AllowedDays);

    [MaxLength(500)] public string? Notes { get; set; }

    // ✅ PROPIEDADES CALCULADAS
    public bool IsAccessExpired => AccessExpiresAt.HasValue && DateTime.UtcNow > AccessExpiresAt.Value;

    public bool IsTimeAllowed => !IsTimeRestricted ||
                                 (DateTime.UtcNow.TimeOfDay >= AllowedStartTime &&
                                  DateTime.UtcNow.TimeOfDay <= AllowedEndTime);

    public bool IsDayAllowed => !IsDayRestricted ||
                                AllowedDays!.Split(',').Contains(DateTime.UtcNow.DayOfWeek.ToString().ToLower());

    public int RemainingUserConsumption => UserConsumptionLimit.HasValue && UserCurrentConsumption.HasValue
        ? Math.Max(0, UserConsumptionLimit.Value - UserCurrentConsumption.Value)
        : 0;

    public bool IsUserConsumptionLimitReached => UserConsumptionLimit.HasValue && UserCurrentConsumption.HasValue
                                                                               && UserCurrentConsumption.Value >=
                                                                               UserConsumptionLimit.Value;
}
