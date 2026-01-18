namespace Configuration.Application.Dtos;

// ✅ DTOs para gestión de políticas de consumo

public record ConsumptionPolicyResponse(
    int Id,
    string Code,
    string Name,
    string? Description,
    string DataType,
    string? DefaultValue,
    string Category,
    string UsageType,
    bool IsActive
);

public record ConsumptionPolicyConfigurationRequest(
    int LicenseTypeId,
    string PolicyCode,
    string PolicyValue,
    string? Reason,
    bool IsOverride = false
);

public record ConsumptionPolicyConfigurationResponse(
    int LicenseTypeId,
    string PolicyCode,
    string PolicyValue,
    string PolicyName,
    string DataType,
    bool IsOverride,
    DateTime ConfiguredAt,
    int ConfiguredByUserId
);

public record ConsumptionPolicyOverrideRequest(
    int LicenseTypeId,
    string PolicyCode,
    string NewValue,
    string Reason,
    int RequestedByUserId,
    DateTime RequestedAt
);

public record ConsumptionPolicyOverrideResponse(
    int Id,
    int LicenseTypeId,
    string PolicyCode,
    string OldValue,
    string NewValue,
    string Reason,
    int RequestedByUserId,
    int? ApprovedByUserId,
    DateTime RequestedAt,
    DateTime? ApprovedAt,
    string Status // "pending", "approved", "rejected"
);

public record ConsumptionPolicyValidationRequest(
    int LicenseTypeId,
    string PolicyCode,
    string ValueToValidate
);

public record ConsumptionPolicyValidationResponse(
    bool IsValid,
    string Message,
    string PolicyCode,
    string ExpectedDataType,
    string? SuggestedValue
);

public record ConsumptionPolicyReportRequest(
    int LicenseTypeId,
    DateTime StartDate,
    DateTime EndDate,
    string? Category = null,
    bool IncludeOverrides = true,
    bool IncludeAuditLog = false
);

public record ConsumptionPolicyReportResponse(
    int LicenseTypeId,
    string LicenseTypeName,
    int TotalPolicies,
    int ActivePolicies,
    int OverridePolicies,
    DateTime ReportGeneratedAt,
    List<ConsumptionPolicySummary> PolicySummaries,
    List<ConsumptionPolicyOverrideSummary> OverrideSummaries
);

public record ConsumptionPolicySummary(
    string PolicyCode,
    string PolicyName,
    string CurrentValue,
    string DefaultValue,
    string DataType,
    bool IsOverridden,
    DateTime? LastModified,
    int? ModifiedByUserId
);

public record ConsumptionPolicyOverrideSummary(
    string PolicyCode,
    string PolicyName,
    string OldValue,
    string NewValue,
    string Reason,
    DateTime RequestedAt,
    int RequestedByUserId,
    string Status
);

// ✅ DTOs para límites específicos por aplicación

public record ApplicationConsumptionLimitsResponse(
    int LicenseTypeId,
    string LicenseTypeName,
    int InvoiceLimit,
    int ProductLimit,
    int UserLimit,
    int StorageLimitMB,
    int ReportLimit,
    bool IsUnlimited
);

public record ConsumptionLimitOverrideRequest(
    int LicenseTypeId,
    string ConsumptionType, // "invoice", "product", "user", "storage", "report"
    int NewLimit,
    string Reason,
    int RequestedByUserId
);

// ✅ DTOs para configuración de overage

public record OverageConfigurationResponse(
    int LicenseTypeId,
    bool IsEnabled,
    decimal BudgetLimit,
    decimal RateMultiplier,
    decimal TaxRate,
    string BillingFrequency
);

public record OverageConfigurationRequest(
    int LicenseTypeId,
    bool IsEnabled,
    decimal? BudgetLimit,
    decimal? RateMultiplier,
    decimal? TaxRate,
    string? BillingFrequency
);

// ✅ DTOs para notificaciones y alertas

public record ConsumptionNotificationSettingsResponse(
    int LicenseTypeId,
    bool IsEnabled,
    int WarningThreshold,
    int GracePeriodDays,
    bool SendEmailNotifications,
    bool SendSMSNotifications,
    List<string> NotificationEmails,
    List<string> NotificationPhones
);

public record ConsumptionNotificationSettingsRequest(
    int LicenseTypeId,
    bool IsEnabled,
    int? WarningThreshold,
    int? GracePeriodDays,
    bool? SendEmailNotifications,
    bool? SendSMSNotifications,
    List<string>? NotificationEmails,
    List<string>? NotificationPhones
);

// ✅ DTOs para reset y mantenimiento

public record ConsumptionResetConfigurationResponse(
    int LicenseTypeId,
    bool IsAutoReset,
    string ResetPeriod,
    DateTime? LastResetDate,
    DateTime? NextResetDate,
    bool IsManualResetAllowed
);

public record ConsumptionResetRequest(
    int LicenseTypeId,
    string ResetPeriod,
    DateTime ResetDate,
    int RequestedByUserId,
    string? Reason
);

// ✅ DTOs para auditoría y compliance

public record ConsumptionPolicyAuditLogResponse(
    int LicenseTypeId,
    DateTime StartDate,
    DateTime EndDate,
    int TotalChanges,
    List<ConsumptionPolicyAuditEntry> AuditEntries
);

public record ConsumptionPolicyAuditEntry(
    int Id,
    string PolicyCode,
    string PolicyName,
    string OldValue,
    string NewValue,
    string ChangeReason,
    DateTime ChangedAt,
    int ChangedByUserId,
    string ChangeType, // "update", "override", "reset", "delete"
    string? UserAgent,
    string? IpAddress
);

public record ConsumptionPolicyComplianceResponse(
    int LicenseTypeId,
    string LicenseTypeName,
    DateTime ComplianceDate,
    int TotalPolicies,
    int CompliantPolicies,
    int NonCompliantPolicies,
    decimal CompliancePercentage,
    List<ComplianceIssue> Issues
);

public record ComplianceIssue(
    string PolicyCode,
    string PolicyName,
    string Issue,
    string Severity, // "low", "medium", "high", "critical"
    string? Recommendation
);
