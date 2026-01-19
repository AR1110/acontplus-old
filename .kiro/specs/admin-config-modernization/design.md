# Documento de Diseño - Modernización de Configuraciones Administrativas

## Visión General

Este módulo moderniza completamente las configuraciones administrativas del sistema, resolviendo problemas críticos de seguridad, eliminando duplicaciones y actualizando estructuras obsoletas. El diseño sigue principios de seguridad por diseño, extensibilidad y mantenibilidad.

### Principios de Diseño

- **Seguridad por Diseño**: Todas las configuraciones sensibles están encriptadas y protegidas
- **Extensibilidad**: Estructuras flexibles que permiten agregar nuevos proveedores y configuraciones
- **Consolidación**: Eliminación de duplicaciones y simplificación de estructuras complejas
- **Modernización**: Actualización a estándares actuales de desarrollo y seguridad
- **Compatibilidad**: Migración gradual manteniendo funcionalidad existente

## Arquitectura Revisada

### Estructura de Capas (Modernizada)

```
Admin.Domain/
├── Entities/Infrastructure/
│   ├── CloudInstance.cs (nuevo - reemplaza Ec2Instance)
│   └── CloudProvider.cs (nuevo)
├── Entities/Config/
│   ├── [EXISTENTES - SE MANTIENEN]
│   ├── Sistema.cs ✓
│   ├── Aplicacion.cs ✓
│   ├── Company.cs ✓
│   ├── PolicyType.cs ✓ (se extiende)
│   ├── CompanyPolicyOverride.cs ✓ (se extiende)
│   ├── [MODERNIZADOS]
│   ├── EmailConfiguration.cs (reemplaza EmailSenderConfig)
│   ├── MenuGroup.cs (nuevo)
│   ├── Menu.cs ✓ (se extiende significativamente)
│   ├── DemoStep.cs ✓ (se extiende)
│   ├── CompanyDemoStep.cs ✓ (se extiende)
│   └── CompanySchedule.cs (reemplaza ScheduleCompany)
├── Entities/Security/
│   ├── [REFACTORIZADOS COMPLETAMENTE]
│   ├── Role.cs (refactorizado)
│   ├── Permission.cs (nuevo)
│   ├── RolePermission.cs (nuevo)
│   ├── UserPermission.cs (nuevo)
│   └── SecurityAudit.cs (nuevo)
├── Entities/Tax/
│   ├── [MODERNIZADOS PARA SRI]
│   ├── EconomicActivity.cs (reemplaza ActividadEconomica)
│   ├── TaxRate.cs (reemplaza TarifaImpuesto)
│   ├── CompanyEconomicActivity.cs (nuevo)
│   └── TaxConfiguration.cs (nuevo)
├── Entities/Audit/
│   ├── PolicyConfigurationAudit.cs ✓ (se extiende)
│   ├── PolicyEnforcementLog.cs ✓ (se extiende)
│   ├── SecurityAuditLog.cs (nuevo)
│   └── SystemAuditLog.cs (nuevo)
└── Entities/Communication/
    ├── EmailConfiguration.cs (nuevo)
    ├── NotificationTemplate.cs (nuevo)
    └── CommunicationAudit.cs (nuevo)

Admin.Application/Config/
├── DTOs/
│   ├── CloudInstanceDto.cs
│   ├── EmailConfigurationDto.cs
│   ├── ModernMenuDto.cs
│   ├── ExtendedDemoStepDto.cs
│   ├── ModernRoleDto.cs
│   ├── PermissionDto.cs
│   ├── EconomicActivityDto.cs
│   └── PolicyConfigurationDto.cs
├── Interfaces/
│   ├── ICloudInstanceService.cs
│   ├── IEmailConfigurationService.cs
│   ├── IModernMenuService.cs
│   ├── IExtendedDemoService.cs
│   ├── IModernSecurityService.cs
│   ├── ITaxConfigurationService.cs
│   └── IPolicyManagementService.cs
└── Services/
    ├── CloudInstanceService.cs
    ├── EmailConfigurationService.cs
    ├── ModernMenuService.cs
    ├── ExtendedDemoService.cs
    ├── ModernSecurityService.cs
    ├── TaxConfigurationService.cs
    └── PolicyManagementService.cs

Admin.Infrastructure/Persistence/
├── Repositories/Infrastructure/
│   └── CloudInstanceRepository.cs
├── Repositories/Config/
│   ├── EmailConfigurationRepository.cs
│   ├── ModernMenuRepository.cs
│   └── ExtendedDemoRepository.cs
├── Repositories/Security/
│   ├── ModernRoleRepository.cs
│   ├── PermissionRepository.cs
│   └── SecurityAuditRepository.cs
├── Repositories/Tax/
│   ├── EconomicActivityRepository.cs
│   └── TaxRateRepository.cs
└── Repositories/Audit/
    ├── ExtendedAuditRepository.cs
    └── SystemAuditRepository.cs

Admin.Api/Controllers/Config/
├── CloudInstanceController.cs
├── EmailConfigurationController.cs
├── ModernMenuController.cs
├── ExtendedDemoController.cs
├── ModernSecurityController.cs
├── TaxConfigurationController.cs
└── PolicyManagementController.cs
```

## Componentes y Interfaces Modernizados

### 1. Infraestructura Cloud Modernizada

#### Entidades Principales

**CloudInstance** (Reemplaza Ec2Instance)
```csharp
[Table("CloudInstance", Schema = "Infrastructure")]
public class CloudInstance : BaseEntity
{
    [Required][MaxLength(50)] public string Provider { get; set; } // "AWS", "Azure", "GCP", "DigitalOcean"
    [Required][MaxLength(50)] public string Region { get; set; }
    [Required][MaxLength(100)] public string InstanceId { get; set; }
    [MaxLength(200)] public string? InstanceName { get; set; }
    [MaxLength(50)] public string? InstanceType { get; set; }
    [Required][MaxLength(45)] public string IpAddress { get; set; } // IPv6 compatible
    [MaxLength(45)] public string? PublicIpAddress { get; set; }
    [MaxLength(45)] public string? PrivateIpAddress { get; set; }
    
    // Management URLs (JSON array)
    [MaxLength(2000)] public string? ManagementUrls { get; set; }
    
    // Status and Health
    public CloudInstanceStatus Status { get; set; }
    public DateTime? LastHealthCheck { get; set; }
    public bool IsHealthy { get; set; } = true
    [MaxLength(500)] public string? HealthCheckErrors { get; set; }
    
    // Configuration (JSON)
    [MaxLength(4000)] public string? Configuration { get; set; }
    [MaxLength(2000)] public string? Tags { get; set; } // JSON key-value pairs
    
    // Costs and Billing
    [Column(TypeName = "numeric(10,4)")] public decimal? HourlyCost { get; set; }
    [Column(TypeName = "numeric(10,4)")] public decimal? MonthlyCost { get; set; }
    [MaxLength(10)] public string? Currency { get; set; } = "USD"
    
    // Relationships
    public int? CompanyId { get; set; }
    public Company? Company { get; set; }
    
    // Calculated Properties
    public bool IsAWS => Provider.Equals("AWS", StringComparison.OrdinalIgnoreCase);
    public bool IsAzure => Provider.Equals("Azure", StringComparison.OrdinalIgnoreCase);
    public bool IsGCP => Provider.Equals("GCP", StringComparison.OrdinalIgnoreCase);
    public bool RequiresHealthCheck => LastHealthCheck == null || LastHealthCheck < DateTime.UtcNow.AddMinutes(-30);
}
```

**CloudProvider** (Nueva - para configuración de proveedores)
```csharp
[Table("CloudProvider", Schema = "Infrastructure")]
public class CloudProvider : BaseEntity
{
    [Required][MaxLength(50)] public string Code { get; set; }
    [Required][MaxLength(100)] public string Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    [MaxLength(200)] public string? ApiEndpoint { get; set; }
    [MaxLength(100)] public string? AuthenticationType { get; set; }
    [MaxLength(2000)] public string? DefaultConfiguration { get; set; } // JSON
    public bool IsActive { get; set; } = true
    public bool SupportsHealthCheck { get; set; } = true
    public bool SupportsCostTracking { get; set; } = false
    [MaxLength(1000)] public string? SupportedRegions { get; set; } // JSON array
    [MaxLength(1000)] public string? SupportedInstanceTypes { get; set; } // JSON array
}
```

#### Servicios

**ICloudInstanceService**
```csharp
public interface ICloudInstanceService
{
    Task<IEnumerable<CloudInstanceDto>> GetInstancesAsync();
    Task<IEnumerable<CloudInstanceDto>> GetInstancesByProviderAsync(string provider);
    Task<CloudInstanceDto> GetInstanceByIdAsync(int id);
    Task<CloudInstanceDto> CreateInstanceAsync(CreateCloudInstanceDto dto);
    Task<CloudInstanceDto> UpdateInstanceAsync(int id, UpdateCloudInstanceDto dto);
    Task<bool> DeleteInstanceAsync(int id);
    Task<HealthCheckResultDto> PerformHealthCheckAsync(int id);
    Task<IEnumerable<CloudInstanceDto>> GetUnhealthyInstancesAsync();
    Task<CostSummaryDto> GetCostSummaryAsync(string? provider = null);
}
```

### 2. Configuración de Email Modernizada

#### Entidades Principales

**EmailConfiguration** (Reemplaza EmailSenderConfig)
```csharp
[Table("EmailConfiguration", Schema = "Config")]
public class EmailConfiguration : BaseEntity
{
    public int? CompanyId { get; set; }
    public Company? Company { get; set; }
    public bool IsGlobal { get; set; } = false
    public bool IsActive { get; set; } = true
    public int Priority { get; set; } = 0 // For failover ordering
    
    // Provider Configuration
    public EmailProvider Provider { get; set; } // SMTP, SendGrid, AWS_SES, Mailgun, etc.
    [MaxLength(500)] public string? ProviderApiKey { get; set; } // Encrypted
    
    // SMTP Configuration (if applicable)
    [MaxLength(200)] public string? SmtpServer { get; set; }
    public int? SmtpPort { get; set; }
    public bool UseSsl { get; set; } = true
    public bool UseStartTls { get; set; } = false
    
    // Authentication (ENCRYPTED)
    [MaxLength(200)] public string? Username { get; set; }
    [MaxLength(1000)] public string? EncryptedCredentials { get; set; } // JSON encrypted
    
    // Sender Information
    [Required][MaxLength(200)] public string SenderEmail { get; set; }
    [Required][MaxLength(200)] public string SenderName { get; set; }
    [MaxLength(200)] public string? ReplyToEmail { get; set; }
    [MaxLength(200)] public string? BounceEmail { get; set; }
    
    // Limits and Throttling
    public int? DailyLimit { get; set; }
    public int? HourlyLimit { get; set; }
    public int? RateLimitPerMinute { get; set; }
    public int? MaxRecipientsPerEmail { get; set; }
    
    // Current Usage Tracking
    public int DailyUsage { get; set; } = 0
    public int HourlyUsage { get; set; } = 0
    public DateTime? LastUsageReset { get; set; }
    
    // Validation and Testing
    public DateTime? LastValidated { get; set; }
    public bool IsValidated { get; set; } = false
    [MaxLength(1000)] public string? ValidationErrors { get; set; } // JSON
    public DateTime? LastTestSent { get; set; }
    
    // Templates and Branding
    [MaxLength(200)] public string? DefaultTemplate { get; set; }
    [MaxLength(2000)] public string? BrandingConfig { get; set; } // JSON
    [MaxLength(1000)] public string? CustomHeaders { get; set; } // JSON
    
    // Monitoring and Analytics
    public int TotalEmailsSent { get; set; } = 0
    public int TotalBounces { get; set; } = 0
    public int TotalComplaints { get; set; } = 0
    public DateTime? LastEmailSent { get; set; }
    
    // Calculated Properties
    public bool IsOverDailyLimit => DailyLimit.HasValue && DailyUsage >= DailyLimit.Value;
    public bool IsOverHourlyLimit => HourlyLimit.HasValue && HourlyUsage >= HourlyLimit.Value;
    public decimal BounceRate => TotalEmailsSent > 0 ? (decimal)TotalBounces / TotalEmailsSent * 100 : 0;
    public decimal ComplaintRate => TotalEmailsSent > 0 ? (decimal)TotalComplaints / TotalEmailsSent * 100 : 0;
    public bool RequiresValidation => !IsValidated || LastValidated < DateTime.UtcNow.AddDays(-30);
}
```

### 3. Sistema de Seguridad Modernizado

#### Entidades Principales

**Role** (Refactorizado completamente)
```csharp
[Table("Role", Schema = "Security")]
public class Role : BaseEntity
{
    [Required][MaxLength(50)] public string Code { get; set; }
    [Required][MaxLength(100)] public string Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    
    // Hierarchy
    public RoleType Type { get; set; } // System, Custom, Inherited, Temporary
    public int? ParentRoleId { get; set; }
    public Role? ParentRole { get; set; }
    public ICollection<Role> ChildRoles { get; set; } = new List<Role>();
    
    // Configuration
    public bool IsActive { get; set; } = true
    public bool IsSystemRole { get; set; } = false
    public bool IsAssignable { get; set; } = true
    public int Priority { get; set; } = 0
    
    // Permissions
    [MaxLength(4000)] public string? DirectPermissions { get; set; } // JSON array
    [MaxLength(4000)] public string? Restrictions { get; set; } // JSON array
    
    // Expiration
    public DateTime? ExpiresAt { get; set; }
    public bool IsTemporary => ExpiresAt.HasValue;
    
    // Relationships
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
    
    // Calculated Properties
    public bool IsExpired => ExpiresAt.HasValue && DateTime.UtcNow > ExpiresAt.Value;
    public bool CanBeAssigned => IsActive && IsAssignable && !IsExpired;
    public int TotalPermissions => RolePermissions?.Count ?? 0;
}
```

**Permission** (Nueva)
```csharp
[Table("Permission", Schema = "Security")]
public class Permission : BaseEntity
{
    [Required][MaxLength(100)] public string Code { get; set; }
    [Required][MaxLength(200)] public string Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    
    // Classification
    public PermissionType Type { get; set; } // Read, Write, Delete, Execute, Admin, Custom
    [MaxLength(100)] public string? Resource { get; set; }
    [MaxLength(100)] public string? Action { get; set; }
    [MaxLength(100)] public string? Category { get; set; } // "User Management", "Financial", "Reports", etc.
    
    // Configuration
    public bool IsSystemPermission { get; set; } = false
    public bool IsActive { get; set; } = true
    public int DisplayOrder { get; set; } = 0
    
    // Dependencies
    [MaxLength(1000)] public string? RequiredPermissions { get; set; } // JSON array
    [MaxLength(1000)] public string? ConflictingPermissions { get; set; } // JSON array
    
    // Risk Assessment
    public PermissionRiskLevel RiskLevel { get; set; } = PermissionRiskLevel.Low
    public bool RequiresApproval { get; set; } = false
    public bool RequiresJustification { get; set; } = false
    
    // Relationships
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
}
```

**RolePermission** (Nueva)
```csharp
[Table("RolePermission", Schema = "Security")]
public class RolePermission : BaseEntity
{
    public int RoleId { get; set; }
    public Role Role { get; set; }
    public int PermissionId { get; set; }
    public Permission Permission { get; set; }
    
    // Grant Configuration
    public bool IsGranted { get; set; } = true
    public bool IsInherited { get; set; } = false
    public bool IsDenied { get; set; } = false // Explicit denial
    
    // Conditions and Restrictions
    [MaxLength(2000)] public string? Conditions { get; set; } // JSON conditions
    [MaxLength(1000)] public string? Restrictions { get; set; } // JSON restrictions
    
    // Expiration
    public DateTime? ExpiresAt { get; set; }
    public bool IsTemporary => ExpiresAt.HasValue;
    
    // Approval
    public bool RequiresApproval { get; set; } = false
    public bool IsApproved { get; set; } = true
    [MaxLength(100)] public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    [MaxLength(500)] public string? ApprovalNotes { get; set; }
    
    // Calculated Properties
    public bool IsExpired => ExpiresAt.HasValue && DateTime.UtcNow > ExpiresAt.Value;
    public bool IsEffective => IsGranted && !IsDenied && !IsExpired && (IsApproved || !RequiresApproval);
}
```

### 4. Sistema de Menús Modernizado

#### Entidades Principales

**MenuGroup** (Nueva)
```csharp
[Table("MenuGroup", Schema = "Config")]
public class MenuGroup : BaseEntity
{
    [Required][MaxLength(50)] public string Code { get; set; }
    [Required][MaxLength(100)] public string Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    
    // Visual Configuration
    [MaxLength(100)] public string? IconClass { get; set; }
    [MaxLength(50)] public string? Color { get; set; }
    [MaxLength(100)] public string? CssClass { get; set; }
    
    // Behavior
    public int DisplayOrder { get; set; } = 0
    public bool IsCollapsible { get; set; } = true
    public bool IsCollapsedByDefault { get; set; } = false
    public bool IsVisible { get; set; } = true
    
    // Permissions
    [MaxLength(1000)] public string? RequiredPermissions { get; set; } // JSON array
    [MaxLength(1000)] public string? RequiredRoles { get; set; } // JSON array
    public int MinUserLevel { get; set; } = 0
    
    // Relationships
    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
```

**Menu** (Extendido significativamente)
```csharp
[Table("Menu", Schema = "Config")]
public class Menu : BaseEntity
{
    // Existing properties
    public required Aplicacion Aplicacion { get; set; }
    public int AplicacionId { get; set; }
    [Required][MaxLength(10)] public required string Code { get; set; }
    [Required][MaxLength(100)] public required string Name { get; set; }
    [Required][MaxLength(500)] public required string Url { get; set; }
    public int Order { get; set; }
    
    // Hierarchy (improved)
    public int? ParentId { get; set; }
    [ForeignKey("ParentId")] public Menu? Parent { get; set; }
    public ICollection<Menu> Children { get; set; } = new List<Menu>();
    public int Level { get; set; } = 0 // Calculated hierarchy level
    
    // Group Association
    public int? MenuGroupId { get; set; }
    public MenuGroup? MenuGroup { get; set; }
    
    // Visual Configuration (extended)
    [MaxLength(200)] public string? Icon { get; set; }
    [MaxLength(100)] public string? IconClass { get; set; }
    [MaxLength(50)] public string? BadgeText { get; set; }
    [MaxLength(50)] public string? BadgeColor { get; set; }
    [MaxLength(200)] public string? Tooltip { get; set; }
    [MaxLength(100)] public string? CssClass { get; set; }
    
    // Behavior Configuration
    public MenuType Type { get; set; } = MenuType.Link // Link, Dropdown, Separator, Header, External
    [MaxLength(20)] public string? Target { get; set; } = "_self" // "_blank", "_self", "_parent"
    public bool IsVisible { get; set; } = true
    public bool IsEnabled { get; set; } = true
    public bool IsHighlighted { get; set; } = false
    
    // Permissions and Access Control
    [MaxLength(1000)] public string? RequiredPermissions { get; set; } // JSON array
    [MaxLength(1000)] public string? RequiredRoles { get; set; } // JSON array
    public int MinUserLevel { get; set; } = 0
    [MaxLength(2000)] public string? ConditionalDisplay { get; set; } // JSON rules
    
    // Analytics and Tracking
    public int ClickCount { get; set; } = 0
    public DateTime? LastAccessed { get; set; }
    public bool TrackUsage { get; set; } = false
    
    // Relationships (existing)
    public ICollection<MenuAction> MenuActions { get; set; } = new List<MenuAction>();
    public ICollection<UserManual> UserManuals { get; set; } = new List<UserManual>();
    
    // Calculated Properties
    public bool HasChildren => Children.Any();
    public bool IsTopLevel => ParentId == null;
    public string FullPath => Parent != null ? $"{Parent.FullPath} > {Name}" : Name;
    public bool IsPopular => ClickCount > 100; // Configurable threshold
}
```

### 5. Sistema de Demostración Extendido

#### Entidades Principales

**DemoStep** (Extendido)
```csharp
[Table("DemoStep", Schema = "Config")]
public class DemoStep : BaseEntity
{
    // Existing properties
    [Required][MaxLength(20)] public required string Code { get; set; }
    [Required][MaxLength(200)] public required string Name { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    public bool Mandatory { get; set; } = true
    
    // Extended properties
    public int EstimatedMinutes { get; set; } = 5
    public int DisplayOrder { get; set; } = 0
    public DemoStepType Type { get; set; } = DemoStepType.Interactive
    
    // Content and Resources
    [MaxLength(500)] public string? VideoUrl { get; set; }
    [MaxLength(500)] public string? DocumentationUrl { get; set; }
    [MaxLength(500)] public string? ThumbnailUrl { get; set; }
    [MaxLength(2000)] public string? Instructions { get; set; }
    
    // Prerequisites and Dependencies
    [MaxLength(1000)] public string? Prerequisites { get; set; } // JSON array of step codes
    [MaxLength(1000)] public string? CompletionCriteria { get; set; } // JSON criteria
    public bool IsSkippable { get; set; } = false
    public bool RequiresInteraction { get; set; } = true
    
    // Targeting and Personalization
    [MaxLength(1000)] public string? TargetRoles { get; set; } // JSON array
    [MaxLength(1000)] public string? TargetIndustries { get; set; } // JSON array
    public int MinUserLevel { get; set; } = 0
    
    // Configuration
    public bool IsActive { get; set; } = true
    public bool CollectFeedback { get; set; } = true
    public bool AllowRetry { get; set; } = true
    public int MaxRetries { get; set; } = 3
    
    // Analytics
    public int TotalAttempts { get; set; } = 0
    public int TotalCompletions { get; set; } = 0
    public decimal AverageRating { get; set; } = 0
    public int AverageCompletionMinutes { get; set; } = 0
    
    // Calculated Properties
    public decimal CompletionRate => TotalAttempts > 0 ? (decimal)TotalCompletions / TotalAttempts * 100 : 0;
    public bool IsPopular => CompletionRate > 80;
    public bool NeedsImprovement => CompletionRate < 50;
}
```

**CompanyDemoStep** (Extendido)
```csharp
[Table("CompanyDemoStep", Schema = "Config")]
public class CompanyDemoStep : BaseEntity
{
    // Existing properties
    public required DemoStep DemoStep { get; set; }
    public int DemoStepId { get; set; }
    public required Company Company { get; set; }
    public int CompanyId { get; set; }
    public Guid Uuid { get; set; }
    
    // Extended tracking properties
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? LastAccessedAt { get; set; }
    public DemoStepStatus Status { get; set; } = DemoStepStatus.NotStarted
    
    // Progress tracking
    public int CompletionPercentage { get; set; } = 0
    public int AttemptCount { get; set; } = 0
    public int TimeSpentMinutes { get; set; } = 0
    
    // User feedback
    public int? Rating { get; set; } // 1-5 stars
    [MaxLength(1000)] public string? UserFeedback { get; set; }
    [MaxLength(500)] public string? CompletionNotes { get; set; }
    
    // Technical tracking
    [MaxLength(100)] public string? CompletedByUserId { get; set; }
    [MaxLength(200)] public string? CompletedByUserName { get; set; }
    [MaxLength(45)] public string? IpAddress { get; set; }
    [MaxLength(500)] public string? UserAgent { get; set; }
    
    // Skip and retry logic
    public bool IsSkipped { get; set; } = false
    [MaxLength(500)] public string? SkipReason { get; set; }
    public DateTime? SkippedAt { get; set; }
    
    // Calculated Properties
    public bool IsCompleted => Status == DemoStepStatus.Completed;
    public bool IsInProgress => Status == DemoStepStatus.InProgress;
    public bool HasFeedback => !string.IsNullOrEmpty(UserFeedback) || Rating.HasValue;
    public TimeSpan? Duration => CompletedAt.HasValue && StartedAt.HasValue ? CompletedAt - StartedAt : null;
}
```

## Enumeraciones Modernizadas

```csharp
public enum CloudInstanceStatus
{
    Unknown = 0,
    Running = 1,
    Stopped = 2,
    Starting = 3,
    Stopping = 4,
    Terminated = 5,
    Error = 6
}

public enum EmailProvider
{
    SMTP = 1,
    SendGrid = 2,
    AWS_SES = 3,
    Mailgun = 4,
    Postmark = 5,
    Mandrill = 6,
    Custom = 99
}

public enum RoleType
{
    System = 1,
    Custom = 2,
    Inherited = 3,
    Temporary = 4
}

public enum PermissionType
{
    Read = 1,
    Write = 2,
    Delete = 3,
    Execute = 4,
    Admin = 5,
    Custom = 99
}

public enum PermissionRiskLevel
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum MenuType
{
    Link = 1,
    Dropdown = 2,
    Separator = 3,
    Header = 4,
    External = 5
}

public enum DemoStepType
{
    Interactive = 1,
    Video = 2,
    Documentation = 3,
    Quiz = 4,
    Guided = 5
}

public enum DemoStepStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Skipped = 3,
    Failed = 4
}
```

## Estrategia de Migración

### Fase 1: Preparación y Limpieza
1. **Backup completo** de datos existentes
2. **Crear nuevas tablas** sin afectar existentes
3. **Implementar servicios de migración** de datos

### Fase 2: Migración de Datos
1. **Migrar Ec2Instance** → CloudInstance
2. **Migrar EmailSenderConfig** → EmailConfiguration (con encriptación)
3. **Migrar datos SRI** → nuevas estructuras modernas

### Fase 3: Refactorización de Seguridad
1. **Crear nuevas estructuras** de Role/Permission
2. **Migrar roles existentes** con mapeo de permisos
3. **Actualizar sistema de autenticación**

### Fase 4: Extensiones y Mejoras
1. **Extender Menu** con nuevas funcionalidades
2. **Extender DemoStep** con tracking avanzado
3. **Implementar nuevas funcionalidades** de auditoría

### Fase 5: Limpieza Final
1. **Eliminar tablas obsoletas** después de validación
2. **Actualizar referencias** en código
3. **Testing completo** de funcionalidades

## APIs REST Modernizadas

### Estructura de Endpoints

```
# Infraestructura Cloud
GET    /api/config/cloud/instances              # Listar instancias
GET    /api/config/cloud/instances/{id}         # Obtener instancia específica
POST   /api/config/cloud/instances              # Crear instancia
PUT    /api/config/cloud/instances/{id}         # Actualizar instancia
DELETE /api/config/cloud/instances/{id}         # Eliminar instancia
POST   /api/config/cloud/instances/{id}/health  # Health check
GET    /api/config/cloud/providers              # Listar proveedores soportados

# Configuración de Email
GET    /api/config/email/configurations         # Listar configuraciones
GET    /api/config/email/configurations/{id}    # Obtener configuración específica
POST   /api/config/email/configurations         # Crear configuración
PUT    /api/config/email/configurations/{id}    # Actualizar configuración
DELETE /api/config/email/configurations/{id}    # Eliminar configuración
POST   /api/config/email/configurations/{id}/validate # Validar configuración
POST   /api/config/email/configurations/{id}/test     # Enviar email de prueba

# Seguridad Modernizada
GET    /api/security/roles                      # Listar roles
GET    /api/security/roles/{id}                 # Obtener rol específico
POST   /api/security/roles                      # Crear rol
PUT    /api/security/roles/{id}                 # Actualizar rol
DELETE /api/security/roles/{id}                 # Eliminar rol
GET    /api/security/permissions                # Listar permisos
GET    /api/security/roles/{id}/permissions     # Permisos de un rol
POST   /api/security/roles/{id}/permissions     # Asignar permisos a rol

# Menús Modernizados
GET    /api/config/menus                        # Listar menús
GET    /api/config/menus/groups                 # Listar grupos de menús
GET    /api/config/menus/hierarchy              # Obtener jerarquía completa
POST   /api/config/menus                        # Crear menú
PUT    /api/config/menus/{id}                   # Actualizar menú
DELETE /api/config/menus/{id}                   # Eliminar menú

# Demostración Extendida
GET    /api/config/demo/steps                   # Listar pasos de demo
GET    /api/config/demo/steps/{id}              # Obtener paso específico
POST   /api/config/demo/steps                   # Crear paso
PUT    /api/config/demo/steps/{id}              # Actualizar paso
GET    /api/config/demo/companies/{id}/progress # Progreso de empresa
POST   /api/config/demo/companies/{id}/start/{stepId} # Iniciar paso
POST   /api/config/demo/companies/{id}/complete/{stepId} # Completar paso

# Configuración Fiscal (SRI)
GET    /api/tax/economic-activities             # Listar actividades económicas
GET    /api/tax/tax-rates                       # Listar tarifas de impuestos
GET    /api/tax/configurations                  # Configuraciones fiscales
POST   /api/tax/configurations                  # Crear configuración fiscal
PUT    /api/tax/configurations/{id}             # Actualizar configuración
```

Este diseño modernizado proporciona una base sólida, segura y extensible para todas las configuraciones administrativas del sistema.