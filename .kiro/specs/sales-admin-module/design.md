# Documento de Diseño - Módulo Administrativo de Ventas y Suscripciones

## Visión General

El módulo administrativo de ventas y suscripciones está diseñado siguiendo la arquitectura Clean Architecture ya establecida en el proyecto, con capas bien definidas (Domain, Application, Infrastructure, API). El módulo se enfoca exclusivamente en operaciones CRUD básicas sin validación de reglas de negocio, proporcionando APIs REST estructuradas para consumo por otros módulos.

### Principios de Diseño

- **Separación de responsabilidades**: Cada capa tiene responsabilidades específicas
- **Sin validación de negocio**: El módulo almacena y recupera datos sin aplicar reglas de negocio
- **APIs estructuradas**: Salidas consistentes y bien organizadas para consumo externo
- **Extensibilidad**: Diseño que permite agregar nuevas funcionalidades sin afectar existentes
- **Consistencia**: Uso de patrones ya establecidos en el proyecto
- **Reutilización**: Aprovechamiento máximo de entidades existentes con extensiones mínimas

## Análisis de Estructura Existente

### Entidades Existentes que se Reutilizan

**Sales Schema - Entidades Principales:**

- `PricingPlan`: Ya implementado con funcionalidades avanzadas (trial, consumo, precios)
- `Subscription`: Completo con historial de renovaciones y cambios de plan
- `PricingPlanFeature`: Maneja la relación entre planes y aplicaciones con configuración de consumo
- `SubscriptionFeature`: Gestiona features por suscripción con tracking de consumo
- `ConsumptionPackage`: Sistema completo de paquetes de consumo con overage
- `ConsumptionTracking`: Seguimiento detallado de uso por feature
- `FeatureUsage`: Registro granular de uso con validación de políticas
- `Coupon`: Sistema básico de cupones (se puede extender)

**Config Schema - Configuración Base:**

- `LicenseType`: Tipos de licencia ya definidos
- `SubscriptionType`: Tipos de suscripción con duración
- `Company`: Entidad de empresa completa
- `Aplicacion`: Aplicaciones del sistema (equivale a "Features")
- `PolicyType`: Sistema de políticas configurables

**Seguridad Schema - Control de Acceso:**

- `PricingPlanAccess`: Control de acceso a planes por roles
- `FeaturePolicyAccess`: Acceso granular a features con restricciones
- `LicenciaAcceso`: Sistema de acceso por licencias

### Conflictos Identificados y Resoluciones

#### 1. Jerarquía de Paquetes

**Conflicto**: El diseño original proponía crear entidades `Package` y `PackageHierarchy`, pero ya existe:

- `Aplicacion` (equivale a Features/Modules)
- `ConsumptionPackage` (paquetes de consumo)
- `PricingPlanFeature` (relación entre planes y features)

**Resolución**:

- **ELIMINAR** las entidades propuestas `Package` y `PackageHierarchy`
- **REUTILIZAR** `Aplicacion` como base para Features
- **EXTENDER** `ConsumptionPackage` para manejar jerarquías ERP/Add-on
- **EXTENDER** `Sistema` y `Aplicacion` existentes con propiedades comerciales

#### 2. Sistema de Precios

**Conflicto**: El diseño proponía `PricingTier`, `Discount`, `Promotion`, pero ya existe:

- `PricingPlan` con precios base y descuentos
- `Coupon` para descuentos
- Sistema de overage en `ConsumptionPackage`

**Resolución**:

- **ELIMINAR** `PricingTier` propuesto
- **EXTENDER** `Coupon` para convertirlo en sistema completo de descuentos/promociones
- **CREAR** `PricingTier` solo si se necesitan precios por volumen específicos
- **REUTILIZAR** sistema de precios existente en `PricingPlan`

#### 3. Configuración de Facturación

**Conflicto**: El diseño proponía `BillingCycle`, pero ya existe:

- `SubscriptionType` con duración y configuración

**Resolución**:

- **ADAPTAR** `SubscriptionType` para incluir configuración de ciclos
- **CREAR** `BillingConfiguration` solo para configuraciones específicas no cubiertas

#### 4. Contratos y Términos

**Conflicto**: No hay conflicto directo, pero se puede integrar mejor.

**Resolución**:

- **MANTENER** `ContractTemplate` y `SubscriptionTerms` como propuestos
- **INTEGRAR** con sistema de políticas existente (`PolicyType`)

#### 5. Configuración de Checkout

**Conflicto**: Parcialmente cubierto por entidades existentes.

**Resolución**:

- **CREAR** `TaxConfiguration` como propuesto
- **CREAR** `PaymentMethod` como propuesto
- **INTEGRAR** con `PricingPlan` y `Company` existentes

## Arquitectura Revisada

### Estructura de Capas (Adaptada a Entidades Existentes)

```
Admin.Domain/
├── Entities/Config/
│   ├── Sistema.cs ✓ (extender con propiedades comerciales)
│   └── Aplicacion.cs ✓ (extender con propiedades comerciales)
├── Entities/Sales/
│   ├── [EXISTENTES - SE REUTILIZAN]
│   ├── PricingPlan.cs ✓
│   ├── Subscription.cs ✓
│   ├── PricingPlanFeature.cs ✓
│   ├── SubscriptionFeature.cs ✓
│   ├── ConsumptionPackage.cs ✓
│   ├── ConsumptionTracking.cs ✓
│   ├── FeatureUsage.cs ✓
│   ├── Coupon.cs ✓ (se extiende)
│   ├── [NUEVOS - MÍNIMOS NECESARIOS]
│   ├── ContractTemplate.cs (nuevo)
│   ├── SubscriptionTerms.cs (nuevo)
│   ├── TaxConfiguration.cs (nuevo)
│   ├── PaymentMethod.cs (nuevo)
│   └── BillingConfiguration.cs (nuevo - solo configuraciones específicas)

Admin.Application/Sales/
├── DTOs/
│   ├── SistemaComercialDto.cs
│   ├── AplicacionComercialDto.cs
│   ├── PricingPlanDto.cs (extender existente)
│   ├── ConsumptionPackageDto.cs (extender existente)
│   ├── CouponDto.cs (extender existente)
│   ├── ContractDto.cs
│   ├── BillingConfigDto.cs
│   └── CheckoutDto.cs
├── Interfaces/
│   ├── ICatalogoComercialService.cs
│   ├── IPricingPlanService.cs (extender existente)
│   ├── IConsumptionPackageService.cs (extender existente)
│   ├── ICouponService.cs (extender existente)
│   ├── IContractService.cs
│   ├── IBillingConfigService.cs
│   └── ICheckoutService.cs
└── Services/
    ├── CatalogoComercialService.cs
    ├── PricingPlanService.cs (extender existente)
    ├── ConsumptionPackageService.cs (extender existente)
    ├── CouponService.cs (extender existente)
    ├── ContractService.cs
    ├── BillingConfigService.cs
    └── CheckoutService.cs

Admin.Infrastructure/Persistence/
├── Repositories/Config/
│   ├── SistemaRepository.cs ✓ (extender existente)
│   └── AplicacionRepository.cs ✓ (extender existente)
├── Repositories/Sales/
│   ├── [EXISTENTES - SE EXTIENDEN]
│   ├── PricingPlanRepository.cs ✓
│   ├── ConsumptionPackageRepository.cs ✓
│   ├── CouponRepository.cs ✓
│   ├── [NUEVOS]
│   ├── ContractRepository.cs
│   ├── BillingConfigRepository.cs
│   └── CheckoutRepository.cs

Admin.Api/Controllers/Sales/
├── SistemaComercialController.cs
├── PricingPlansController.cs (extender existente)
├── ConsumptionPackagesController.cs (extender existente)
├── CouponsController.cs (extender existente)
├── ContractsController.cs
├── BillingController.cs
└── CheckoutController.cs
```

## Componentes y Interfaces Revisados

### 1. Gestión de Catálogo Comercial (Reutilizando Sistema y Aplicacion existentes)

#### Entidades Principales (Extendidas)

**Sistema** (Existente - se extiende con propiedades comerciales)

```csharp
// Extensión de la entidad existente mediante partial class
public partial class Sistema
{
    // Propiedades comerciales
    [MaxLength(500)] public string? CommercialDescription { get; set; }
    [MaxLength(100)] public string? TargetMarket { get; set; }
    public SystemType SystemType { get; set; } // ERP, POS, CRM, Contabilidad, Ecommerce
    public bool IsActive { get; set; } = true;
    
    // Propiedades calculadas
    public bool IsSpecializedByIndustry => Aplicaciones.Any(a => !string.IsNullOrEmpty(a.IndustryTarget));
    public IEnumerable<string> SupportedIndustries => Aplicaciones
        .Where(a => !string.IsNullOrEmpty(a.IndustryTarget))
        .Select(a => a.IndustryTarget)
        .Distinct();
}
```

**Aplicacion** (Existente - se extiende con propiedades calculadas)

```csharp
// Extensión de la entidad existente mediante partial class
public partial class Aplicacion
{
    // Propiedades calculadas para jerarquías
    public ICollection<ApplicationHierarchy> ParentHierarchies { get; set; }
    public ICollection<ApplicationHierarchy> ChildHierarchies { get; set; }

    // Métodos de conveniencia
    public bool IsERPModule => ParentHierarchies.Any(h => h.HierarchyType == ApplicationType.ERP);
    public bool IsAddOn => ParentHierarchies.Any(h => h.HierarchyType == ApplicationType.AddOn);
    public bool IsFeature => ParentHierarchies.Any(h => h.HierarchyType == ApplicationType.Feature);
}
```

#### Servicios

**ISistemaComercialService**

```csharp
public interface ISistemaComercialService
{
    Task<IEnumerable<SistemaComercialDto>> GetSistemasComerciales();
    Task<IEnumerable<AplicacionComercialDto>> GetAplicacionesBySystemType(SystemType systemType);
    Task<IEnumerable<AplicacionComercialDto>> GetAplicacionesByIndustry(string industry);
    Task<CatalogoComercialDto> GetCatalogoCompleto();
    Task<SistemaComercialDto> UpdateSistemaComercial(int sistemaId, UpdateSistemaComercialDto dto);
    Task<AplicacionComercialDto> UpdateAplicacionComercial(int aplicacionId, UpdateAplicacionComercialDto dto);
}
```

### 2. Sistema de Precios y Reglas (Reutilizando entidades existentes)

#### Entidades Principales (Existentes - se extienden)

**PricingPlan** (Existente - ya completo)

```csharp
// La entidad existente ya tiene:
// - BasePrice, TaxRate, DiscountRate
// - Trial configuration
// - Consumption-based pricing
// - Overage configuration
// - Custom plan support
// - Effective price calculations
```

**Coupon** (Existente - se extiende para ser sistema completo de descuentos)

```csharp
// Extensión de la entidad existente
public partial class Coupon
{
    // Nuevas propiedades para convertirlo en sistema completo
    [MaxLength(100)] public string? Name { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    public CouponType Type { get; set; } = CouponType.Discount; // Discount, Promotion
    public DiscountType DiscountType { get; set; } = DiscountType.Percentage;
    public DateTime? StartDate { get; set; }
    public int? UsageLimit { get; set; }
    public int? UsageCount { get; set; }
    public bool IsActive { get; set; } = true;

    // Condiciones de aplicación (JSON)
    [MaxLength(2000)] public string? Conditions { get; set; }

    // Planes aplicables
    public ICollection<PricingPlan> ApplicablePlans { get; set; }

    // Propiedades calculadas
    public bool IsExpired => ExpiryDate < DateTime.UtcNow;
    public bool IsUsageLimitReached => UsageLimit.HasValue && UsageCount >= UsageLimit.Value;
    public bool CanBeUsed => IsActive && !IsExpired && !IsUsageLimitReached;
    public decimal EffectiveDiscount => Discount ?? (Percent ?? 0);
}
```

**ConsumptionPackage** (Existente - ya completo para precios por volumen)

```csharp
// La entidad existente ya maneja:
// - Pricing tiers por cantidad
// - Overage rates
// - Volume discounts
// - Reset periods
// - Consumption limits
```

### 3. Configuración de Facturación (Adaptando SubscriptionType existente)

#### Entidades Principales

**SubscriptionType** (Existente - se extiende)

```csharp
// Extensión de la entidad existente
public partial class SubscriptionType
{
    // Nuevas propiedades para configuración de facturación
    public int? CutoffDay { get; set; }
    public int? GracePeriodDays { get; set; }
    public bool? AutoRenew { get; set; } = true;
    public string? BillingFrequency { get; set; } // "monthly", "quarterly", "yearly"

    // Propiedades calculadas
    public bool IsCustomDuration => Duration.HasValue && !BillingFrequency.HasValue;
    public string DisplayFrequency => BillingFrequency ?? $"{Duration} días";
}
```

**BillingConfiguration** (Nueva - solo para configuraciones específicas)

```csharp
[Table("BillingConfiguration", Schema = "Sales")]
public class BillingConfiguration : BaseEntity
{
    public int PricingPlanId { get; set; }
    public PricingPlan PricingPlan { get; set; }

    public int SubscriptionTypeId { get; set; }
    public SubscriptionType SubscriptionType { get; set; }

    // Configuraciones específicas de facturación
    public bool RequirePaymentMethod { get; set; } = true;
    public bool AllowProration { get; set; } = true;
    public int? InvoiceGenerationDays { get; set; } = 3; // Días antes del vencimiento
    public int? PaymentReminderDays { get; set; } = 7;

    // Configuración de impuestos
    public bool CalculateTaxes { get; set; } = true;
    public string? TaxCalculationMethod { get; set; } = "automatic";

    // Configuración de descuentos
    public bool AllowCoupons { get; set; } = true;
    public bool AllowVolumeDiscounts { get; set; } = true;
}
```

### 4. Gestión de Contratos y Términos

#### Entidades Principales

**ContractTemplate**

```csharp
public class ContractTemplate : BaseEntity
{
    public string Name { get; set; }
    public string Content { get; set; } // Contenido con variables
    public string Variables { get; set; } // JSON con variables disponibles
    public ContractType Type { get; set; }
    public string Version { get; set; }
    public bool IsActive { get; set; }
    public DateTime EffectiveDate { get; set; }
    public ICollection<SubscriptionTerms> SubscriptionTerms { get; set; }
}
```

**SubscriptionTerms**

```csharp
public class SubscriptionTerms : BaseEntity
{
    public int SubscriptionId { get; set; }
    public Subscription Subscription { get; set; }
    public int ContractTemplateId { get; set; }
    public ContractTemplate ContractTemplate { get; set; }
    public string AcceptedVersion { get; set; }
    public DateTime AcceptedDate { get; set; }
    public string AcceptedByUserId { get; set; }
}
```

### 5. Configuración de Checkout (Nuevas entidades necesarias)

#### Entidades Principales

**TaxConfiguration** (Nueva)

```csharp
[Table("TaxConfiguration", Schema = "Sales")]
public class TaxConfiguration : BaseEntity
{
    [Required][MaxLength(3)] public string CountryCode { get; set; }
    [MaxLength(10)] public string? StateCode { get; set; }
    [Required][MaxLength(100)] public string TaxName { get; set; }
    [Column(TypeName = "numeric(5,4)")] public decimal TaxRate { get; set; }
    public TaxType Type { get; set; } // VAT, SalesTax, GST, IVA
    public bool IsActive { get; set; } = true;

    // Configuración adicional
    public bool IsCompound { get; set; } = false; // Impuesto compuesto
    public int? Priority { get; set; } = 1; // Orden de aplicación
    [MaxLength(500)] public string? Description { get; set; }

    // Fechas de vigencia
    public DateTime? EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }

    // Relaciones
    public ICollection<PricingPlan> ApplicablePlans { get; set; }
}
```

**PaymentMethod** (Nueva)

```csharp
[Table("PaymentMethod", Schema = "Sales")]
public class PaymentMethod : BaseEntity
{
    [Required][MaxLength(20)] public string Code { get; set; }
    [Required][MaxLength(100)] public string Name { get; set; }
    public PaymentType Type { get; set; } // CreditCard, BankTransfer, PayPal, Stripe
    [MaxLength(2000)] public string? Configuration { get; set; } // JSON con configuración específica
    public bool IsActive { get; set; } = true;

    // Configuración de disponibilidad
    [MaxLength(1000)] public string? SupportedCountries { get; set; } // JSON array
    [MaxLength(1000)] public string? SupportedCurrencies { get; set; } // JSON array

    // Configuración de procesamiento
    public decimal? ProcessingFee { get; set; }
    public decimal? ProcessingFeePercentage { get; set; }
    public int? ProcessingDays { get; set; }

    // Configuración de UI
    [MaxLength(200)] public string? DisplayName { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    [MaxLength(100)] public string? IconUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;

    // Relaciones
    public ICollection<PricingPlan> AvailableForPlans { get; set; }
}
```

**CheckoutConfiguration** (Nueva - integrada con entidades existentes)

```csharp
[Table("CheckoutConfiguration", Schema = "Sales")]
public class CheckoutConfiguration : BaseEntity
{
    public int PricingPlanId { get; set; }
    public PricingPlan PricingPlan { get; set; }

    [MaxLength(3)] public string? CountryCode { get; set; }

    // Configuración de checkout
    public bool RequiresBillingAddress { get; set; } = true;
    public bool RequiresShippingAddress { get; set; } = false;
    public bool AllowTrialWithoutPayment { get; set; } = false;
    public bool RequirePhoneVerification { get; set; } = false;
    public bool RequireEmailVerification { get; set; } = true;

    // Configuración de términos
    public bool RequireTermsAcceptance { get; set; } = true;
    public int? ContractTemplateId { get; set; }
    public ContractTemplate? ContractTemplate { get; set; }

    // Configuración de precios
    public bool ShowTaxBreakdown { get; set; } = true;
    public bool ShowDiscountBreakdown { get; set; } = true;
    public bool AllowCouponCodes { get; set; } = true;

    // Relaciones many-to-many
    public ICollection<PaymentMethod> AvailablePaymentMethods { get; set; }
    public ICollection<TaxConfiguration> ApplicableTaxes { get; set; }
}
```

## Modelos de Datos

### DTOs de Respuesta (Adaptados a entidades existentes)

**SistemaComercialDto**

```csharp
public class SistemaComercialDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? DomainUrl { get; set; }
    public string? CommercialDescription { get; set; }
    public string? TargetMarket { get; set; }
    public SystemType SystemType { get; set; }
    public decimal? BasePrice { get; set; }
    public bool IsActive { get; set; }
    public IEnumerable<AplicacionComercialDto> Aplicaciones { get; set; }
}
```

**AplicacionComercialDto**

```csharp
public class AplicacionComercialDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? DomainUrl { get; set; }
    public decimal? BasePrice { get; set; }
    public string? IndustryTarget { get; set; }
    public bool IsSpecializedByIndustry { get; set; }
    public string? CommercialDescription { get; set; }
    public bool IsAvailableForSale { get; set; }
    public int DisplayOrder { get; set; }
    public SistemaComercialDto Sistema { get; set; }
    
    // Propiedades calculadas
    public bool IsERPModule { get; set; }
    public bool IsPOSModule { get; set; }
    public bool IsCRMModule { get; set; }
    public bool IsContabilidadModule { get; set; }
    public bool IsEcommerceModule { get; set; }
}
```

**CatalogoComercialDto**

```csharp
public class CatalogoComercialDto
{
    public IEnumerable<SistemaComercialDto> Sistemas { get; set; }
    public IEnumerable<string> IndustriasDisponibles { get; set; }
    public IEnumerable<SystemType> TiposSistema { get; set; }
    public int TotalAplicaciones { get; set; }
    public int AplicacionesEspecializadas { get; set; }
}
```

**ApplicationDto** (Extendiendo Aplicacion existente)

```csharp
public class ApplicationDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? DomainUrl { get; set; }
    public SistemaDto Sistema { get; set; } // MANTENER - Relevante para agrupación

    // Propiedades de jerarquía
    public ApplicationType? Type { get; set; }
    public IEnumerable<ApplicationDto> ChildApplications { get; set; }
    public IEnumerable<ApplicationDto> ParentApplications { get; set; }
    public bool IsERPModule { get; set; }
    public bool IsAddOn { get; set; }
    public bool IsFeature { get; set; }
}
```

**SistemaDto** (Para completar la información)

```csharp
public class SistemaDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? DomainUrl { get; set; }
    public IEnumerable<ApplicationDto> Applications { get; set; }
}
```

**PricingPlanDto** (Extendiendo existente)

```csharp
public class PricingPlanDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public LicenseTypeDto LicenseType { get; set; }
    public SubscriptionTypeDto SubscriptionType { get; set; }

    // Precios
    public decimal BasePrice { get; set; }
    public decimal? TaxRate { get; set; }
    public decimal? DiscountRate { get; set; }
    public decimal EffectivePrice { get; set; }

    // Configuración de trial
    public bool IsTrial { get; set; }
    public int? TrialDays { get; set; }
    public bool RequireCreditCardForTrial { get; set; }
    public bool AutoConvertToPaid { get; set; }

    // Configuración de consumo
    public bool IsConsumptionBased { get; set; }
    public string? ConsumptionModel { get; set; }
    public bool AllowOverage { get; set; }
    public decimal? OverageRate { get; set; }

    // Features incluidos
    public IEnumerable<PricingPlanFeatureDto> Features { get; set; }

    // Configuración de checkout
    public CheckoutConfigurationDto? CheckoutConfiguration { get; set; }
}
```

**CheckoutDataDto** (Integrado con entidades existentes)

```csharp
public class CheckoutDataDto
{
    public PricingPlanDto Plan { get; set; }
    public IEnumerable<ConsumptionPackageDto> ConsumptionPackages { get; set; }
    public IEnumerable<CouponDto> ApplicableCoupons { get; set; }
    public IEnumerable<TaxConfigurationDto> ApplicableTaxes { get; set; }
    public IEnumerable<PaymentMethodDto> AvailablePaymentMethods { get; set; }

    // Cálculos de precios
    public decimal BasePrice { get; set; }
    public decimal SubTotal { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal TotalTax { get; set; }
    public decimal FinalPrice { get; set; }

    // Configuración
    public CheckoutConfigurationDto Configuration { get; set; }
    public ContractTemplateDto? ContractTemplate { get; set; }

    // Información adicional
    public string Currency { get; set; } = "USD";
    public string CountryCode { get; set; }
    public bool CanStartTrial { get; set; }
    public int? TrialDays { get; set; }
}
```

**CouponDto** (Extendiendo Coupon existente)

```csharp
public class CouponDto
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CouponType Type { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal? Discount { get; set; }
    public decimal? Percent { get; set; }
    public decimal EffectiveDiscount { get; set; }
    public DateTime ExpiryDate { get; set; }
    public DateTime? StartDate { get; set; }
    public int? UsageLimit { get; set; }
    public int? UsageCount { get; set; }
    public bool IsActive { get; set; }
    public bool CanBeUsed { get; set; }
    public IEnumerable<PricingPlanDto> ApplicablePlans { get; set; }
}
```

### Enumeraciones (Adaptadas al contexto existente)

```csharp
public enum SystemType
{
    ERP = 1,
    POS = 2,
    CRM = 3,
    Contabilidad = 4,
    Ecommerce = 5
}

public enum CouponType
{
    Discount = 1,
    Promotion = 2,
    VolumeDiscount = 3
}

public enum DiscountType
{
    Percentage = 1,
    FixedAmount = 2
}

public enum ContractType
{
    Standard = 1,
    Enterprise = 2,
    Trial = 3,
    Custom = 4
}

public enum TaxType
{
    IVA = 1,      // Ecuador
    VAT = 2,      // Europa
    SalesTax = 3, // USA
    GST = 4,      // Canadá/Australia
    Other = 5
}

public enum PaymentType
{
    CreditCard = 1,
    DebitCard = 2,
    BankTransfer = 3,
    PayPal = 4,
    Stripe = 5,
    Cash = 6,
    Check = 7,
    Other = 8
}
```

## Manejo de Errores

### Estrategia de Manejo de Errores

1. **Errores de Validación**: Retornar BadRequest con detalles específicos
2. **Entidades No Encontradas**: Retornar NotFound con mensaje descriptivo
3. **Errores de Base de Datos**: Retornar InternalServerError con mensaje genérico
4. **Errores de Autorización**: Retornar Unauthorized/Forbidden según corresponda

### Estructura de Respuesta de Error

```csharp
public class ErrorResponse
{
    public string Message { get; set; }
    public string Code { get; set; }
    public IEnumerable<string> Details { get; set; }
    public DateTime Timestamp { get; set; }
}
```

## Estrategia de Testing

### Tipos de Tests

1. **Unit Tests**: Para servicios y lógica de negocio básica
2. **Integration Tests**: Para repositorios y acceso a datos
3. **API Tests**: Para endpoints y contratos de API

### Estructura de Tests

```
Admin.Tests/
├── Unit/
│   ├── Sales/
│   │   ├── PackageServiceTests.cs
│   │   ├── PricingServiceTests.cs
│   │   └── CheckoutServiceTests.cs
├── Integration/
│   ├── Repositories/
│   │   ├── PackageRepositoryTests.cs
│   │   └── PricingRepositoryTests.cs
└── Api/
    ├── Controllers/
    │   ├── PackagesControllerTests.cs
    │   └── CheckoutControllerTests.cs
```

### Herramientas de Testing

- **xUnit**: Framework de testing principal
- **Moq**: Para mocking de dependencias
- **FluentAssertions**: Para assertions más legibles
- **TestContainers**: Para tests de integración con base de datos

## Consideraciones de Rendimiento

### Optimizaciones

1. **Lazy Loading**: Configurado para relaciones no críticas
2. **Eager Loading**: Para datos frecuentemente consultados juntos
3. **Caching**: Implementación de cache para datos de configuración estáticos
4. **Paginación**: Para listados grandes de datos
5. **Índices de Base de Datos**: En campos de búsqueda frecuente

### Estrategias de Cache

```csharp
public interface ICacheService
{
    Task<T> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan expiration);
    Task RemoveAsync(string key);
}
```

## Seguridad

### Consideraciones de Seguridad

1. **Autenticación**: Uso del sistema JWT existente
2. **Autorización**: Validación de permisos básicos sin lógica de negocio
3. **Sanitización**: Limpieza de inputs para prevenir inyecciones
4. **Logging**: Registro de operaciones críticas para auditoría

### Implementación de Seguridad

- Uso de atributos `[Authorize]` en controladores
- Validación de modelos con Data Annotations
- Sanitización automática de strings en DTOs
- Logging estructurado con Serilog (si está configurado)

## APIs REST

### Estructura de Endpoints (Adaptada a entidades existentes)

```
# Catálogo Comercial de Sistemas y Aplicaciones
GET    /api/sales/sistemas/comercial          # Obtener catálogo comercial completo
GET    /api/sales/sistemas/{systemType}       # Listar sistemas por tipo (ERP, POS, CRM, etc.)
GET    /api/sales/aplicaciones/industry/{industry} # Aplicaciones por industria
GET    /api/sales/aplicaciones/system/{systemId} # Aplicaciones por sistema
PUT    /api/sales/sistemas/{id}/comercial     # Actualizar propiedades comerciales de sistema
PUT    /api/sales/aplicaciones/{id}/comercial # Actualizar propiedades comerciales de aplicación

# Planes de Precios (Extendiendo existentes)
GET    /api/sales/pricing-plans               # Listar planes
GET    /api/sales/pricing-plans/{id}          # Obtener plan específico
POST   /api/sales/pricing-plans               # Crear plan
PUT    /api/sales/pricing-plans/{id}          # Actualizar plan
DELETE /api/sales/pricing-plans/{id}          # Eliminar plan
GET    /api/sales/pricing-plans/{id}/features # Features del plan
GET    /api/sales/pricing-plans/{id}/consumption # Paquetes de consumo

# Paquetes de Consumo (Extendiendo existentes)
GET    /api/sales/consumption-packages        # Listar paquetes
GET    /api/sales/consumption-packages/{id}   # Obtener paquete específico
POST   /api/sales/consumption-packages        # Crear paquete
PUT    /api/sales/consumption-packages/{id}   # Actualizar paquete
DELETE /api/sales/consumption-packages/{id}   # Eliminar paquete

# Cupones y Descuentos (Extendiendo Coupon existente)
GET    /api/sales/coupons                     # Listar cupones/descuentos
GET    /api/sales/coupons/{id}                # Obtener cupón específico
GET    /api/sales/coupons/validate/{code}     # Validar código de cupón
POST   /api/sales/coupons                     # Crear cupón
PUT    /api/sales/coupons/{id}                # Actualizar cupón
DELETE /api/sales/coupons/{id}                # Eliminar cupón

# Configuración de Facturación
GET    /api/sales/billing/configurations      # Listar configuraciones
GET    /api/sales/billing/configurations/{planId} # Config por plan
POST   /api/sales/billing/configurations      # Crear configuración
PUT    /api/sales/billing/configurations/{id} # Actualizar configuración
DELETE /api/sales/billing/configurations/{id} # Eliminar configuración

# Contratos y Términos
GET    /api/sales/contracts/templates         # Listar plantillas
GET    /api/sales/contracts/templates/{id}    # Obtener plantilla específica
POST   /api/sales/contracts/templates         # Crear plantilla
PUT    /api/sales/contracts/templates/{id}    # Actualizar plantilla
DELETE /api/sales/contracts/templates/{id}    # Eliminar plantilla
GET    /api/sales/contracts/terms/{subId}     # Términos de suscripción

# Configuración de Impuestos
GET    /api/sales/taxes                       # Listar configuraciones de impuestos
GET    /api/sales/taxes/{country}             # Impuestos por país
GET    /api/sales/taxes/{country}/{state}     # Impuestos por estado/provincia
POST   /api/sales/taxes                       # Crear configuración de impuesto
PUT    /api/sales/taxes/{id}                  # Actualizar configuración
DELETE /api/sales/taxes/{id}                  # Eliminar configuración

# Métodos de Pago
GET    /api/sales/payment-methods             # Listar métodos de pago
GET    /api/sales/payment-methods/{country}   # Métodos por país
POST   /api/sales/payment-methods             # Crear método de pago
PUT    /api/sales/payment-methods/{id}        # Actualizar método
DELETE /api/sales/payment-methods/{id}        # Eliminar método

# Configuración de Checkout (Integrado)
GET    /api/sales/checkout/config/{planId}    # Configuración completa para checkout
GET    /api/sales/checkout/config/{planId}/{country} # Config por país
POST   /api/sales/checkout/calculate          # Calcular precios para checkout
GET    /api/sales/checkout/validate-coupon/{code} # Validar cupón en checkout
```

### Formato de Respuesta Estándar

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public IEnumerable<string> Errors { get; set; }
}
```

Este diseño proporciona una base sólida para el módulo administrativo de ventas y suscripciones, manteniendo la consistencia con la arquitectura existente y enfocándose en operaciones CRUD básicas sin validación de reglas de negocio.

#

# Resumen de Cambios y Adaptaciones

### Entidades que se REUTILIZAN (sin cambios)

- `PricingPlan` ✓ - Ya completo con todas las funcionalidades necesarias
- `Subscription` ✓ - Sistema completo de suscripciones con historial
- `PricingPlanFeature` ✓ - Relación entre planes y aplicaciones
- `SubscriptionFeature` ✓ - Features por suscripción con tracking
- `ConsumptionPackage` ✓ - Sistema completo de paquetes de consumo
- `ConsumptionTracking` ✓ - Seguimiento detallado de uso
- `FeatureUsage` ✓ - Registro granular de uso
- `LicenseType` ✓ - Tipos de licencia
- `SubscriptionType` ✓ - Tipos de suscripción
- `Company` ✓ - Entidad de empresa
- `Aplicacion` ✓ - Aplicaciones/Features del sistema

### Entidades que se EXTIENDEN (partial classes o nuevas propiedades)

- `Coupon` → Sistema completo de descuentos y promociones
- `SubscriptionType` → Configuración de facturación
- `Aplicacion` → Propiedades calculadas para jerarquías

### Entidades NUEVAS (mínimas necesarias)

- Extensiones a `Sistema` y `Aplicacion` - Para propiedades comerciales
- `BillingConfiguration` - Configuraciones específicas de facturación
- `ContractTemplate` - Plantillas de contratos
- `SubscriptionTerms` - Términos por suscripción
- `TaxConfiguration` - Configuración de impuestos
- `PaymentMethod` - Métodos de pago
- `CheckoutConfiguration` - Configuración de checkout

### Entidades ELIMINADAS del diseño original

- `Package` - Reemplazado por `Aplicacion` existente
- `PackageHierarchy` - Funcionalidad cubierta por `Sistema->Aplicacion` existente
- `PricingTier` - Funcionalidad cubierta por `ConsumptionPackage`
- `Discount` - Funcionalidad cubierta por `Coupon` extendido
- `Promotion` - Funcionalidad cubierta por `Coupon` extendido
- `BillingCycle` - Funcionalidad cubierta por `SubscriptionType` extendido

### Beneficios de esta Adaptación

1. **Máxima Reutilización**: Aprovecha el 80% de las entidades existentes
2. **Mínima Disrupción**: Solo agrega lo estrictamente necesario
3. **Consistencia**: Mantiene patrones y convenciones existentes
4. **Funcionalidad Completa**: Cubre todos los requisitos sin duplicación
5. **Extensibilidad**: Permite crecimiento futuro sin conflictos
6. **Mantenibilidad**: Reduce la complejidad del modelo de datos

Este diseño revisado es mucho más eficiente y realista, aprovechando al máximo la infraestructura existente mientras proporciona todas las funcionalidades requeridas para el módulo administrativo de ventas y suscripciones.

## A

nálisis de la Entidad `Sistema`

### **Relevancia para el Módulo Administrativo de Ventas**

La entidad `Sistema` **NO es irrelevante** pero tiene **relevancia CONTEXTUAL**:

#### ✅ **Casos donde SÍ es relevante:**

1. **Paquetes Multi-Sistema**: Si vendes paquetes que incluyen aplicaciones de diferentes sistemas (ERP + CRM + Contabilidad)
2. **Precios por Sistema**: Si los precios base varían según el sistema al que pertenece la aplicación
3. **Licenciamiento por Sistema**: Si las licencias se otorgan por sistema completo vs. aplicaciones individuales
4. **Configuración de Checkout**: Si diferentes sistemas requieren configuraciones específicas
5. **Jerarquías de Negocio**: Para organizar la oferta comercial por líneas de producto/sistema

#### ⚠️ **Casos donde es menos crítica:**

1. **CRUD Básico**: Para operaciones simples de planes y suscripciones
2. **Configuración de Precios**: Los precios se manejan principalmente a nivel de `PricingPlan`
3. **Checkout Simple**: Si solo vendes aplicaciones individuales

### **Recomendación de Implementación:**

**MANTENER `Sistema` en el diseño** porque:

1. **Consistencia**: Ya está integrada en el modelo existente
2. **Flexibilidad**: Permite agrupaciones comerciales por sistema
3. **Escalabilidad**: Facilita futuras expansiones del catálogo
4. **Información Contextual**: Ayuda a los módulos de ventas a presentar ofertas organizadas

### **Uso Práctico en APIs:**

```
# Obtener aplicaciones por sistema (útil para catálogos organizados)
GET /api/sales/applications/by-system/{sistemaId}

# Obtener jerarquía completa incluyendo agrupación por sistema
GET /api/sales/applications/hierarchy?groupBySystem=true

# Configuración de checkout que puede variar por sistema
GET /api/sales/checkout/config/{planId}?systemId={sistemaId}
```

**Conclusión**: `Sistema` es **ALTAMENTE RELEVANTE** para el mercado ecuatoriano porque:

### **Casos de Uso Reales en Ecuador:**

1. **Paquetes Comerciales Típicos**:

   - **Paquete PYME**: ERP básico + Contabilidad ($80-150/mes)
   - **Paquete Comercial**: ERP + CRM + Contabilidad ($150-300/mes)
   - **Paquete Empresarial**: Todos los sistemas + módulos avanzados ($300-800/mes)

2. **Regulaciones por Sistema**:

   - **ERP**: Inventarios con valoración FIFO/promedio
   - **Contabilidad**: SRI, facturación electrónica, ATS, retenciones
   - **CRM**: Protección de datos, marketing digital

3. **Implementación Gradual**: Las empresas ecuatorianas típicamente:
   - **Fase 1**: Contabilidad (obligatorio)
   - **Fase 2**: ERP (crecimiento del negocio)
   - **Fase 3**: CRM (madurez comercial)

### **Arquitectura Visual Recomendada:**

**UN SOLO PROYECTO** con subdominios por sistema para maximizar integración y minimizar costos.

## Estructura de Módulos por Sistema (Ecuador)

### **🏢 Sistema ERP**

```
Aplicaciones Core:
├── INVENTARIOS (INV)
│   ├── Gestión de Stock
│   ├── Kardex Valorado
│   ├── Transferencias
│   └── Toma Física
├── COMPRAS (COM)
│   ├── Órdenes de Compra
│   ├── Recepción
│   └── Gestión de Proveedores
├── VENTAS (VEN)
│   ├── Cotizaciones
│   ├── Pedidos
│   └── Facturación
├── PRODUCCION (PRO)
│   ├── Órdenes de Producción
│   ├── BOM (Lista de Materiales)
│   └── Control de Calidad
└── RRHH (RRH)
    ├── Nómina
    ├── Roles de Pago
    └── Reportes IESS
```

### **💼 Sistema CRM**

```
Aplicaciones de Relación:
├── LEADS (LEA)
│   ├── Prospección
│   ├── Seguimiento
│   └── Calificación
├── CLIENTES (CLI)
│   ├── Base de Datos
│   ├── Segmentación
│   └── Historial
├── MARKETING (MAR)
│   ├── Campañas
│   ├── Email Marketing
│   └── Redes Sociales
└── SOPORTE (SOP)
    ├── Tickets
    ├── Garantías
    └── Satisfacción
```

### **📊 Sistema Contabilidad**

```
Aplicaciones Financieras:
├── CONTABILIDAD (CON)
│   ├── Plan de Cuentas
│   ├── Asientos Contables
│   └── Estados Financieros
├── SRI (SRI)
│   ├── Facturación Electrónica
│   ├── Declaraciones IVA
│   ├── Retenciones
│   └── ATS (Anexo Transaccional)
├── BANCOS (BAN)
│   ├── Conciliaciones
│   ├── Cheques
│   └── Transferencias
└── CARTERA (CAR)
    ├── Cuentas por Cobrar
    ├── Cuentas por Pagar
    └── Análisis de Vencimientos
```

## Impacto en el Modelo de Precios

### **Estrategia de Paquetes Sugerida:**

```csharp
// Ejemplo de configuración de paquetes para Ecuador
public static class EcuadorPackages
{
    public static readonly PricingPlan PaquetePYME = new()
    {
        Code = "PYME_EC",
        Name = "Paquete PYME Ecuador",
        BasePrice = 120m,
        Systems = new[] { "ERP_BASIC", "CONTABILIDAD" },
        Features = new[] { "INV", "COM", "VEN", "CON", "SRI", "BAN" }
    };

    public static readonly PricingPlan PaqueteComercial = new()
    {
        Code = "COMERCIAL_EC",
        Name = "Paquete Comercial Ecuador",
        BasePrice = 250m,
        Systems = new[] { "ERP", "CRM", "CONTABILIDAD" },
        Features = new[] { "INV", "COM", "VEN", "LEA", "CLI", "CON", "SRI", "BAN", "CAR" }
    };
}
```

Esta estructura confirma que la entidad `Sistema` es **fundamental** para el módulo administrativo de ventas en el contexto ecuatoriano.
## Sistemas Actualizados - Incluyendo POS Especializados

### **🏢 Sistema ERP (Enterprise Resource Planning)**
```
Aplicaciones Core Empresariales:
├── INVENTARIOS (INV)
│   ├── Gestión de Stock Avanzada
│   ├── Kardex Valorado
│   ├── Transferencias entre Bodegas
│   └── Toma Física
├── COMPRAS (COM)
│   ├── Órdenes de Compra
│   ├── Recepción y Control de Calidad
│   └── Gestión de Proveedores
├── VENTAS_ERP (VER)
│   ├── Cotizaciones Complejas
│   ├── Pedidos B2B
│   └── Facturación Empresarial
├── PRODUCCION (PRO)
│   ├── Órdenes de Producción
│   ├── BOM (Lista de Materiales)
│   └── Control de Calidad
└── RRHH (RRH)
    ├── Nómina
    ├── Roles de Pago
    └── Reportes IESS
```

### **🏪 Sistema POS (Point of Sale) - NUEVO SISTEMA**
```
Aplicaciones Especializadas por Industria:
├── POS_RESTAURANTE (POR)
│   ├── Mesas y Comandas
│   ├── Cocina (KDS - Kitchen Display System)
│   ├── Delivery/Takeout
│   ├── Propinas y Turnos
│   └── Inventario de Ingredientes
├── POS_VETERINARIA (POV)
│   ├── Historias Clínicas
│   ├── Citas y Agenda
│   ├── Vacunas y Tratamientos
│   ├── Mascotas y Dueños
│   └── Inventario Médico
├── POS_BARBERIA (POB)
│   ├── Agenda de Citas
│   ├── Servicios y Combos
│   ├── Barberos y Comisiones
│   ├── Membresías
│   └── Productos de Belleza
├── POS_RETAIL (PRT)
│   ├── Ventas Rápidas
│   ├── Códigos de Barras
│   ├── Promociones
│   ├── Devoluciones
│   └── Inventario Básico
├── POS_FARMACIA (POF)
│   ├── Medicamentos Controlados
│   ├── Recetas Médicas
│   ├── Vencimientos
│   ├── Lotes y Series
│   └── Inventario Farmacéutico
├── POS_AUTOMOTRIZ (POA)
│   ├── Servicios de Taller
│   ├── Repuestos y Partes
│   ├── Órdenes de Trabajo
│   └── Historial de Vehículos
├── POS_GIMNASIO (POG)
│   ├── Membresías
│   ├── Clases y Horarios
│   ├── Entrenadores
│   └── Productos Deportivos
└── POS_GENERAL (POG)
    ├── Ventas Básicas
    ├── Inventario Simple
    ├── Clientes
    └── Reportes
```

### **💼 Sistema CRM (Customer Relationship Management)**
```
Aplicaciones de Relación:
├── LEADS (LEA)
│   ├── Prospección
│   ├── Seguimiento
│   └── Calificación
├── CLIENTES (CLI)
│   ├── Base de Datos
│   ├── Segmentación
│   └── Historial
├── MARKETING (MAR)
│   ├── Campañas
│   ├── Email Marketing
│   └── Redes Sociales
└── SOPORTE (SOP)
    ├── Tickets
    ├── Garantías
    └── Satisfacción
```

### **📊 Sistema Contabilidad (Accounting)**
```
Aplicaciones Financieras:
├── CONTABILIDAD (CON)
│   ├── Plan de Cuentas
│   ├── Asientos Contables
│   └── Estados Financieros
├── SRI (SRI)
│   ├── Facturación Electrónica
│   ├── Declaraciones IVA
│   ├── Retenciones
│   └── ATS (Anexo Transaccional)
├── BANCOS (BAN)
│   ├── Conciliaciones
│   ├── Cheques
│   └── Transferencias
└── CARTERA (CAR)
    ├── Cuentas por Cobrar
    ├── Cuentas por Pagar
    └── Análisis de Vencimientos
```

### **📱 Sistema ECOMMERCE (E-Commerce) - ADICIONAL**
```
Aplicaciones de Comercio Digital:
├── TIENDA_ONLINE (TON)
│   ├── Catálogo Web
│   ├── Carrito de Compras
│   └── Checkout Online
├── MARKETPLACE (MAR)
│   ├── Integración MercadoLibre
│   ├── Amazon
│   └── Otros Marketplaces
└── REDES_SOCIALES (RED)
    ├── Facebook Shop
    ├── Instagram Shopping
    └── WhatsApp Business
```

## Impacto de POS en el Modelo de Precios

### **Nuevos Paquetes Comerciales con POS:**

```csharp
// Paquetes especializados por industria
public static class EcuadorPOSPackages
{
    public static readonly PricingPlan PaqueteRestaurante = new()
    {
        Code = "RESTAURANT_EC",
        Name = "Paquete Restaurante Ecuador",
        BasePrice = 80m,
        Systems = new[] { "POS", "CONTABILIDAD" },
        Features = new[] { "POR", "CON", "SRI", "BAN" }
    };
    
    public static readonly PricingPlan PaqueteVeterinaria = new()
    {
        Code = "VETERINARY_EC",
        Name = "Paquete Veterinaria Ecuador", 
        BasePrice = 90m,
        Systems = new[] { "POS", "CRM", "CONTABILIDAD" },
        Features = new[] { "POV", "CLI", "CON", "SRI" }
    };
    
    public static readonly PricingPlan PaqueteBarberia = new()
    {
        Code = "BARBERSHOP_EC",
        Name = "Paquete Barbería Ecuador",
        BasePrice = 60m,
        Systems = new[] { "POS", "CRM" },
        Features = new[] { "POB", "CLI", "MAR" }
    };
    
    public static readonly PricingPlan PaqueteRetail = new()
    {
        Code = "RETAIL_EC", 
        Name = "Paquete Retail Ecuador",
        BasePrice = 100m,
        Systems = new[] { "POS", "ERP_BASIC", "CONTABILIDAD" },
        Features = new[] { "PRT", "INV", "COM", "CON", "SRI" }
    };
}
```

## Respuesta a tu Pregunta Principal

### **¿A qué sistema deberían pertenecer los POS especializados?**

**RESPUESTA: POS debe ser un SISTEMA SEPARADO, NO parte de ERP**

### **Razones:**

1. **Flujos de Negocio Únicos**: Cada industria tiene procesos muy específicos
2. **Interfaces Especializadas**: UX optimizada para cada tipo de negocio
3. **Funcionalidades Exclusivas**: Features que no aplican a ERP general
4. **Precios Diferenciados**: Modelos de precios específicos por industria
5. **Implementación Independiente**: Se pueden vender sin ERP completo

### **Arquitectura Visual Recomendada:**

```
https://miempresa.com/
├── /pos              # Sistema POS (con subsecciones por industria)
│   ├── /restaurante  # POS Restaurante
│   ├── /veterinaria  # POS Veterinaria  
│   ├── /barberia     # POS Barbería
│   └── /retail       # POS Retail
├── /erp              # Sistema ERP
├── /crm              # Sistema CRM
├── /contabilidad     # Sistema Contabilidad
├── /ecommerce        # Sistema E-commerce
└── /admin            # Administración
```

### **Ventajas de POS como Sistema Separado:**

1. **Especialización**: Cada POS optimizado para su industria
2. **Escalabilidad**: Fácil agregar nuevas industrias
3. **Precios Flexibles**: Modelos específicos por sector
4. **Desarrollo Independiente**: Equipos especializados por industria
5. **Integración Opcional**: Puede funcionar solo o con otros sistemas

**Conclusión**: La entidad `Sistema` es **CRÍTICA** para manejar esta diversidad de sistemas especializados, especialmente con POS por industria.## Arqu
itectura de Módulos Compartidos vs Especializados

### **🔧 Módulos CORE (Compartidos entre todos los sistemas)**

```
Admin.Domain/Entities/Core/
├── CONFIGURACIONES (CORE_CONFIG)
│   ├── Company.cs ✓ (existente)
│   ├── Sistema.cs ✓ (existente) 
│   ├── Aplicacion.cs ✓ (existente)
│   ├── PolicyType.cs ✓ (existente)
│   └── SystemConfiguration.cs (nuevo)
├── CLIENTES (CORE_CUSTOMERS)
│   ├── Customer.cs (nuevo - base común)
│   ├── CustomerType.cs (nuevo)
│   ├── CustomerContact.cs (nuevo)
│   └── CustomerAddress.cs (nuevo)
├── PROVEEDORES (CORE_SUPPLIERS)
│   ├── Supplier.cs (nuevo - base común)
│   ├── SupplierType.cs (nuevo)
│   ├── SupplierContact.cs (nuevo)
│   └── SupplierAddress.cs (nuevo)
├── PRODUCTOS (CORE_PRODUCTS)
│   ├── Product.cs (nuevo - base común)
│   ├── ProductCategory.cs (nuevo)
│   ├── ProductUnit.cs (nuevo)
│   ├── ProductPrice.cs (nuevo)
│   └── ProductVariant.cs (nuevo)
├── FACTURACION (CORE_BILLING)
│   ├── Invoice.cs (nuevo - base común)
│   ├── InvoiceItem.cs (nuevo)
│   ├── InvoiceType.cs (nuevo)
│   ├── PaymentTerm.cs (nuevo)
│   └── TaxConfiguration.cs ✓ (ya diseñado)
├── SEGURIDAD (CORE_SECURITY)
│   ├── AppUser.cs ✓ (existente)
│   ├── AppRole.cs ✓ (existente)
│   ├── Permission.cs (nuevo)
│   ├── UserPermission.cs (nuevo)
│   └── AuditLog.cs (nuevo)
└── NOTIFICACIONES (CORE_NOTIFICATIONS)
    ├── Notification.cs (nuevo)
    ├── NotificationTemplate.cs (nuevo)
    ├── NotificationChannel.cs (nuevo)
    └── UserNotification.cs (nuevo)
```

### **🎯 Módulos ESPECIALIZADOS (Por Sistema/Industria)**

```
Admin.Domain/Entities/Specialized/
├── ERP/
│   ├── ERPInventory.cs (hereda de Product)
│   ├── ERPPurchaseOrder.cs (hereda de Invoice)
│   ├── ERPProductionOrder.cs (especializado)
│   └── ERPWorkCenter.cs (especializado)
├── POS/
│   ├── Restaurant/
│   │   ├── RestaurantTable.cs (especializado)
│   │   ├── RestaurantOrder.cs (hereda de Invoice)
│   │   ├── RestaurantMenuItem.cs (hereda de Product)
│   │   └── RestaurantKitchen.cs (especializado)
│   ├── Veterinary/
│   │   ├── VeterinaryPet.cs (hereda de Customer)
│   │   ├── VeterinaryOwner.cs (hereda de Customer)
│   │   ├── VeterinaryTreatment.cs (hereda de Product)
│   │   └── VeterinaryAppointment.cs (especializado)
│   ├── Barbershop/
│   │   ├── BarbershopService.cs (hereda de Product)
│   │   ├── BarbershopBarber.cs (hereda de AppUser)
│   │   ├── BarbershopAppointment.cs (especializado)
│   │   └── BarbershopMembership.cs (especializado)
│   └── Retail/
│       ├── RetailProduct.cs (hereda de Product)
│       ├── RetailPromotion.cs (especializado)
│       ├── RetailLoyalty.cs (especializado)
│       └── RetailInventory.cs (hereda de Product)
├── CRM/
│   ├── CRMLead.cs (hereda de Customer)
│   ├── CRMOpportunity.cs (especializado)
│   ├── CRMCampaign.cs (especializado)
│   └── CRMActivity.cs (especializado)
└── ECOMMERCE/
    ├── EcommerceProduct.cs (hereda de Product)
    ├── EcommerceCart.cs (especializado)
    ├── EcommerceOrder.cs (hereda de Invoice)
    └── EcommerceShipping.cs (especializado)
```

## Estrategia de Herencia y Composición

### **Patrón de Herencia para Entidades Base**

```csharp
// Entidad base compartida
[Table("Customer", Schema = "Core")]
public class Customer : BaseEntity
{
    [Required][MaxLength(15)] public string IdCard { get; set; }
    [Required][MaxLength(300)] public string Name { get; set; }
    [MaxLength(300)] public string Email { get; set; }
    [MaxLength(100)] public string Phone { get; set; }
    public CustomerType Type { get; set; }
    
    // Propiedades comunes a todos los sistemas
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
}

// Especialización para Veterinaria
[Table("VeterinaryOwner", Schema = "POS")]
public class VeterinaryOwner : Customer
{
    // Propiedades específicas de dueños de mascotas
    public string EmergencyContact { get; set; }
    public string PreferredVet { get; set; }
    public ICollection<VeterinaryPet> Pets { get; set; }
}

// Especialización para Restaurante
[Table("RestaurantCustomer", Schema = "POS")]
public class RestaurantCustomer : Customer
{
    // Propiedades específicas de clientes de restaurante
    public string FoodAllergies { get; set; }
    public string PreferredTable { get; set; }
    public int LoyaltyPoints { get; set; }
}
```

### **Patrón de Composición para Funcionalidades**

```csharp
// Interfaz para funcionalidades compartidas
public interface IInventoryManagement
{
    decimal CurrentStock { get; set; }
    decimal MinimumStock { get; set; }
    decimal MaximumStock { get; set; }
    void UpdateStock(decimal quantity, string reason);
    bool IsLowStock();
}

// Implementación en diferentes contextos
public class ERPInventory : Product, IInventoryManagement
{
    // Implementación compleja para ERP
    public void UpdateStock(decimal quantity, string reason)
    {
        // Lógica compleja con kardex, valoración, etc.
    }
}

public class POSInventory : Product, IInventoryManagement  
{
    // Implementación simple para POS
    public void UpdateStock(decimal quantity, string reason)
    {
        // Lógica simple para POS
        CurrentStock += quantity;
    }
}
```

## Contextos y Nichos de Mercado

### **🎯 Segmentación por Tamaño de Empresa**

#### **MICRO EMPRESAS (1-5 empleados)**
```
Contexto: Negocios familiares, emprendimientos
Sistemas: POS especializado + Contabilidad básica
Precio: $30-80/mes

Ejemplos:
├── Restaurante familiar
├── Barbería de barrio  
├── Veterinaria pequeña
├── Tienda de abarrotes
└── Farmacia independiente
```

#### **PEQUEÑAS EMPRESAS (6-50 empleados)**
```
Contexto: Empresas establecidas con crecimiento
Sistemas: POS + CRM básico + Contabilidad + ERP básico
Precio: $80-250/mes

Ejemplos:
├── Cadena de restaurantes (2-5 locales)
├── Clínica veterinaria con múltiples doctores
├── Retail con inventario complejo
├── Taller automotriz
└── Gimnasio con múltiples servicios
```

#### **MEDIANAS EMPRESAS (51-200 empleados)**
```
Contexto: Empresas con procesos complejos
Sistemas: ERP completo + CRM + Contabilidad + E-commerce
Precio: $250-800/mes

Ejemplos:
├── Distribuidora de productos
├── Empresa manufacturera
├── Cadena retail (5+ locales)
├── Hospital veterinario
└── Empresa de servicios
```

### **🏭 Segmentación por Industria**

#### **SERVICIOS PERSONALES**
```
Sistemas Principales: POS + CRM + Contabilidad
Módulos Compartidos: Clientes, Citas, Facturación, Pagos

Industrias:
├── Barberías y Salones de Belleza
├── Spas y Centros de Relajación  
├── Gimnasios y Centros Deportivos
├── Clínicas Dentales
└── Centros de Estética
```

#### **ALIMENTACIÓN Y BEBIDAS**
```
Sistemas Principales: POS + Inventario + Contabilidad
Módulos Compartidos: Productos, Inventario, Facturación, Proveedores

Industrias:
├── Restaurantes y Cafeterías
├── Bares y Discotecas
├── Panaderías y Pastelerías  
├── Food Trucks
└── Catering y Eventos
```

#### **SALUD Y BIENESTAR**
```
Sistemas Principales: POS + CRM + Historiales + Contabilidad
Módulos Compartidos: Pacientes, Citas, Tratamientos, Facturación

Industrias:
├── Veterinarias y Pet Shops
├── Clínicas Médicas
├── Farmacias
├── Laboratorios
└── Centros de Fisioterapia
```

#### **RETAIL Y COMERCIO**
```
Sistemas Principales: POS + Inventario + E-commerce + Contabilidad
Módulos Compartidos: Productos, Inventario, Clientes, Ventas

Industrias:
├── Tiendas de Ropa y Accesorios
├── Ferreterías y Materiales
├── Supermercados y Minimarkets
├── Librerías y Papelerías
└── Tiendas de Electrónicos
```

## Arquitectura de Código Compartido

### **Estructura de Proyectos**

```
Admin.Core/                    # Módulos compartidos
├── Entities/
│   ├── Customer.cs
│   ├── Product.cs  
│   ├── Invoice.cs
│   └── ...
├── Interfaces/
│   ├── IInventoryManagement.cs
│   ├── ICustomerManagement.cs
│   └── ...
└── Services/
    ├── CustomerService.cs
    ├── ProductService.cs
    └── ...

Admin.POS.Restaurant/          # Especialización Restaurante
├── Entities/
│   ├── RestaurantTable.cs
│   ├── RestaurantOrder.cs (hereda Invoice)
│   └── ...
├── Services/
│   ├── TableService.cs
│   ├── KitchenService.cs
│   └── ...

Admin.POS.Veterinary/          # Especialización Veterinaria
├── Entities/
│   ├── VeterinaryPet.cs
│   ├── VeterinaryTreatment.cs
│   └── ...
├── Services/
│   ├── PetService.cs
│   ├── TreatmentService.cs
│   └── ...

Admin.ERP/                     # Sistema ERP
├── Entities/
│   ├── ERPInventory.cs (hereda Product)
│   ├── PurchaseOrder.cs
│   └── ...
```

### **Configuración por Contexto**

```csharp
public class SystemContext
{
    public SystemType Type { get; set; }
    public IndustryType Industry { get; set; }
    public CompanySize Size { get; set; }
    
    public IEnumerable<string> EnabledModules { get; set; }
    public Dictionary<string, object> Configuration { get; set; }
}

// Configuración específica por contexto
public static class ContextConfigurations
{
    public static SystemContext RestaurantSmall => new()
    {
        Type = SystemType.POS,
        Industry = IndustryType.Restaurant,
        Size = CompanySize.Micro,
        EnabledModules = new[] { "TABLES", "KITCHEN", "BILLING", "CUSTOMERS" },
        Configuration = new Dictionary<string, object>
        {
            ["MaxTables"] = 20,
            ["KitchenDisplay"] = true,
            ["DeliveryIntegration"] = false
        }
    };
    
    public static SystemContext VeterinaryMedium => new()
    {
        Type = SystemType.POS,
        Industry = IndustryType.Veterinary,
        Size = CompanySize.Small,
        EnabledModules = new[] { "PETS", "APPOINTMENTS", "TREATMENTS", "INVENTORY", "BILLING" },
        Configuration = new Dictionary<string, object>
        {
            ["MaxPetsPerOwner"] = 10,
            ["VaccineTracking"] = true,
            ["InventoryManagement"] = true
        }
    };
}
```

## Beneficios de esta Arquitectura

### **✅ Reutilización de Código**
- 70-80% del código es compartido
- Módulos core reutilizables
- Especializaciones mínimas por industria

### **✅ Mantenimiento Eficiente**
- Cambios en módulos core afectan todos los sistemas
- Especializaciones independientes
- Testing centralizado para funcionalidades comunes

### **✅ Escalabilidad Comercial**
- Fácil agregar nuevas industrias
- Configuración flexible por contexto
- Precios diferenciados por funcionalidad

### **✅ Experiencia de Usuario Optimizada**
- Interfaces especializadas por industria
- Flujos de trabajo optimizados
- Terminología específica del sector

Esta arquitectura te permite maximizar la reutilización mientras ofreces experiencias especializadas por industria.