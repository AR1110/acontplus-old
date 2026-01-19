# Suscripción Legacy → Subscription Modern Migration Plan

**Date:** 2026-01-19
**Status:** Ready for Execution
**Risk Level:** MEDIUM (with validation safeguards)

---

## 📋 Overview

Este plan migra el sistema legacy de suscripciones (tablas `Suscripcion` y `SuscripcionDetalle` en español) al nuevo modelo moderno de `Subscription` y `SubscriptionFeature`, basado en el diseño de `.kiro/specs/sales-admin-module`.

**Key principle:** Los datos existentes se consolidan en `PricingPlan` primero, luego se migran las instancias a `Subscription`.

---

## 🎯 Migration Phases

### Phase 1: Planning & Analysis (COMPLETE)

- [x] Entender estructura de tablas legacy
- [x] Mapear campos entre modelos old ↔ new
- [x] Identificar problemas potenciales
- [x] Crear scripts de migración
- [x] Crear validación

### Phase 2: Database Migration (PENDING)

**Scripts a ejecutar en orden:**

#### 1️⃣ `001_consolidate_pricing_plans.sql`

**Propósito:** Extraer planes de datos existentes y crear `PricingPlan` consolidados

**Qué hace:**

- Analiza `Suscripcion` + `SubscriptionType` para entender patrones de precios
- Crea un `PricingPlan` por cada `SubscriptionType` único
- Genera codes como `MIGR_<original_code>` (ej: `MIGR_PREM`, `MIGR_STD`)
- Calcula BasePrice, TaxRate, DiscountRate promediando datos históricos

**Entrada:**

```
Sales.Suscripcion
Sales.SuscripcionDetalle
Config.SubscriptionType
```

**Salida:**

```
Sales.PricingPlan (nuevos registros con código MIGR_*)
```

**Duración:** ~2-5 min (depende de volumen)

**Validación posterior:**

```sql
SELECT COUNT(*) FROM Sales.PricingPlan WHERE Code LIKE 'MIGR_%';
-- Debería = número de SubscriptionTypes activos
```

---

#### 2️⃣ `002_migrate_subscriptions.sql`

**Propósito:** Migrar instancias de `Suscripcion` → `Subscription`

**Qué hace:**

- Mapea cada `Suscripcion` a su correspondiente `PricingPlan` (MIGR\_\*)
- Inserta en `Sales.Subscription`
- Copia todos los campos relevantes (StartDate, EndDate, Cost, Tax, etc.)
- Crea log de migración en `Sales.MigrationLog_Suscripcion`

**Entrada:**

```
Sales.Suscripcion
Sales.PricingPlan (MIGR_* records)
```

**Salida:**

```
Sales.Subscription (nuevos registros)
Sales.MigrationLog_Suscripcion (log de mapeos)
```

**Duración:** ~5-10 min

**Validación posterior:**

```sql
SELECT COUNT(*) FROM Sales.Subscription
WHERE CreatedAt >= DATEADD(DAY, -1, GETUTCDATE());
-- Debería ≈ número de Suscripciones activas
```

---

#### 3️⃣ `003_migrate_subscription_details.sql`

**Propósito:** Migrar líneas de detalles → Features

**⚠️ CRÍTICO:** Requiere mapeo manual de `LicenciaDetalleId` → `ApplicationId`

**Qué hace:**

- Analiza `SuscripcionDetalle` para entender features usados
- Crea tabla temporal con mapping de LicenceDetails
- **PAUSA:** Usuario debe llenar `ApplicationId` para cada `LicenciaDetalleId`
- Inserta en `Sales.SubscriptionFeature`
- Crea `PricingPlanFeature` si es necesario

**Entrada:**

```
Sales.SuscripcionDetalle
Sales.Subscription (creados en step anterior)
LicenceDetailId → ApplicationId MAPPING (MANUAL)
```

**Salida:**

```
Sales.SubscriptionFeature (nuevos registros)
Sales.PricingPlanFeature (si es necesario)
```

**Duración:** ~10 min (+ tiempo manual del usuario para mapeo)

**⚠️ Paso manual requerido:**

```sql
-- Después de ejecutar 003_migrate_subscription_details.sql
-- El script se pausará solicitando el mapeo

-- Usuario debe ejecutar y llenar:
UPDATE LicenceDetailToApplicationMap
SET ApplicationId = <config.Aplicacion.Id>
WHERE LicenciaDetalleId = <your_value>;

-- Luego continuar con la inserción
```

---

#### 4️⃣ `004_validate_migration.sql`

**Propósito:** Validación integral de resultados

**Qué valida:**

- ✓ Row counts match
- ✓ Referential integrity (no orphans)
- ✓ Data completeness (no NULLs where not allowed)
- ✓ Financial data consistency (sums match)
- ✓ Date ranges valid
- ✓ Audit trail logged

**Salida:** Reporte detallado con:

- Conteos de registros migrados
- Errores encontrados (si los hay)
- Recomendaciones

**Duración:** ~2 min

---

### Phase 3: Application Code Migration (PENDING)

**Archivos a cambiar:**

#### Eliminar (legacy code):

```
src/Services/Sales/Sales.Domain/Entities/Suscripcion.cs
src/Services/Sales/Sales.Domain/Entities/SuscripcionDetalle.cs
src/Services/Sales/Sales.Application/Services/SuscripcionService.cs
src/Services/Sales/Sales.Application/Services/SuscripcionDetalleService.cs
src/Services/Sales/Sales.Application/Interfaces/ISuscripcionService.cs
src/Services/Sales/Sales.Application/Interfaces/ISuscripcionDetalleService.cs
src/Services/Sales/Sales.Application/Dtos/SuscripcionDtos.cs
src/Services/Sales/Sales.Application/Dtos/CreateSuscripcionRequestDto.cs
src/Services/Sales/Sales.Application/Dtos/UpdateSuscripcionRequestDto.cs
src/Services/Sales/Sales.Api/Endpoints/SuscripcionEndpoints/
src/Services/Sales/Sales.Api/Endpoints/SuscripcionDetalleEndpoints/
```

#### Actualizar:

```
src/Services/Sales/Sales.Infrastructure/Persistence/SalesContext.cs
- Remover: public DbSet<Suscripcion> Suscripciones { get; set; }
- Remover: public DbSet<SuscripcionDetalle> SuscripcionDetalles { get; set; }

src/Services/Sales/Sales.Infrastructure/Persistence/Configurations/SalesConfiguration.cs
- Remover: SuscripcionConfiguration
- Remover: SuscripcionDetalleConfiguration

src/Services/Sales/Program.cs
- Remover registraciones de ISuscripcionService
- Remover registraciones de ISuscripcionDetalleService
- Verificar que SubscriptionService esté registrado
```

#### Crear (new code - si no existe):

```
src/Services/Sales/Sales.Application/Services/SubscriptionService.cs
src/Services/Sales/Sales.Application/Interfaces/ISubscriptionService.cs
src/Services/Sales/Sales.Api/Endpoints/SubscriptionEndpoints/
```

---

### Phase 4: Frontend Updates (PENDING)

```
src/WebApps/WebUI/Pages/Shared/_LicensesModal.cshtml
- Actualizar referencias de "Suscripcion" a "Subscription"
- Cambiar "SuscripcionDetalle" a "SubscriptionFeature"

src/WebApps/client/src/app/modules/*/
- Buscar rutas: /suscripciones/* → cambiar a /subscriptions/*
- Actualizar servicios que usen endpoints legacy
```

---

## 🔄 Execution Flow

```
START
  ↓
[001] Consolidate Plans
  ✓ Verify PricingPlans created (MIGR_*)
  ↓
[002] Migrate Subscriptions
  ✓ Verify Subscription row count matches
  ✓ Verify MigrationLog populated
  ↓
[003] Migrate Details
  ⚠️  MANUAL: Fill LicenceDetailId → ApplicationId mapping
  ✓ Verify SubscriptionFeatures created
  ↓
[004] Validate All
  ✓ All validations pass?
    ├─ YES → Continue to Phase 3 (Code Migration)
    └─ NO  → ROLLBACK and investigate
  ↓
[Phase 3] Update Application Code
  ✓ Remove legacy entities & services
  ✓ Update DbContext
  ✓ Build & test
  ↓
[Phase 4] Update Frontend
  ✓ Update endpoints
  ✓ Update routes
  ✓ Test UI
  ↓
[Final] Archive Legacy Tables
  ✓ Backup old tables (if paranoid)
  ✓ DROP Suscripcion & SuscripcionDetalle
  ↓
SUCCESS ✓
```

---

## 📊 Data Mapping Reference

### Suscripcion → Subscription

| Legacy             | →   | New            | Notes                                |
| ------------------ | --- | -------------- | ------------------------------------ |
| Id                 | →   | Id             | Same                                 |
| SubscriptionTypeId | →   | PricingPlanId  | Via PricingPlan.SubscriptionTypeId   |
| CompanyId          | →   | CompanyId      | Same                                 |
| StartDate          | →   | StartDate      | Same                                 |
| EndDate            | →   | EndDate        | Same                                 |
| MaxPaymentDate     | →   | MaxPaymentDate | Same                                 |
| Cost               | →   | Cost           | Same                                 |
| Tax                | →   | Tax            | Same                                 |
| Discount           | →   | Discount       | Same                                 |
| Total              | →   | Total          | Same                                 |
| Paid               | →   | Paid           | Same                                 |
| WarningMessage     | →   | WarningMessage | Same                                 |
| (BaseEntity)       | →   | (BaseEntity)   | IsActive, IsDeleted, CreatedAt, etc. |

### SuscripcionDetalle → SubscriptionFeature

| Legacy            | →   | New                  | Notes                       |
| ----------------- | --- | -------------------- | --------------------------- |
| Id                | →   | Id                   | Same                        |
| SuscripcionId     | →   | SubscriptionId       | Via MigrationLog            |
| LicenciaDetalleId | →   | PricingPlanFeatureId | MANUAL mapping needed!      |
| StartDate         | →   | ActivatedAt          | Semantic change             |
| EndDate           | →   | DeactivatedAt        | Semantic change             |
| MaxPaymentDate    | →   | (NULL)               | Not applicable in new model |
| Cost              | →   | OverrideCost         | Override model              |
| Tax               | →   | OverrideTax          | Override model              |
| Discount          | →   | OverrideDiscount     | Override model              |
| Total             | →   | OverrideTotal        | Override model              |
| IsPaid            | →   | (NULL)               | Not tracking per-feature    |
| (BaseEntity)      | →   | (BaseEntity)         | Same as above               |

---

## ⚠️ Potential Issues & Mitigation

### Issue 1: SubscriptionTypeId has no 1:1 relationship with plans

**Problem:** Multiple subscription types might map to same plan or vice versa
**Mitigation:** Script creates one plan per type. If plans need consolidation, manual merge after migration.

### Issue 2: LicenciaDetalleId mapping is manual

**Problem:** No automatic way to know which ApplicationId corresponds to LicenceDetailId
**Mitigation:** Script pauses for user to provide mapping. Document the process.

### Issue 3: MaxPaymentDate in details becomes meaningless

**Problem:** New model doesn't track this per-feature
**Mitigation:** Could store in SubscriptionFeature.Notes if critical; otherwise accept data loss.

### Issue 4: Paid flag on details lost

**Problem:** New model only tracks payment at Subscription level
**Mitigation:** If needed for auditing, migrate to audit table or notes.

---

## ✅ Validation Checklist

After each phase, verify:

### After Phase 2 (DB Migration):

- [ ] All 4 SQL scripts executed without errors
- [ ] `004_validate_migration.sql` shows all ✓ OK
- [ ] MigrationLog contains all mappings
- [ ] No orphan records found
- [ ] Financial totals match between old and new

### After Phase 3 (Code Migration):

- [ ] Project builds without errors
- [ ] Unit tests pass
- [ ] Integration tests pass (using new models)
- [ ] DbContext migration created and applied

### After Phase 4 (Frontend):

- [ ] UI renders without errors
- [ ] Subscription list loads
- [ ] Feature details display correctly
- [ ] No console errors in browser

### Before Archive:

- [ ] 2+ weeks in production with monitoring
- [ ] No bug reports related to subscriptions
- [ ] Backup of old tables taken
- [ ] Historical queries don't depend on old tables

---

## 🚨 Rollback Procedure

If anything fails:

```sql
-- Step 1: Delete new data
DELETE FROM Sales.SubscriptionFeature WHERE CreatedAt >= '2026-01-19';
DELETE FROM Sales.Subscription WHERE CreatedAt >= '2026-01-19';
DELETE FROM Sales.PricingPlan WHERE Code LIKE 'MIGR_%';
DELETE FROM Sales.MigrationLog_Suscripcion;

-- Step 2: Revert application code
-- - Restore SuscripcionService & SuscripcionDetalleService
-- - Restore DbContext
-- - Rebuild

-- Step 3: Revert DB
-- - Run rollback migration in EF Core

-- Step 4: Test
-- - Verify old endpoints work
-- - Check data completeness
```

---

## 📞 Support & Questions

**For questions about:**

- **Database:** Check Scripts in `database/Scripts/Migration/`
- **Mapping:** Review `003_migrate_subscription_details.sql` comments
- **Validation:** Run `004_validate_migration.sql` and review output
- **Rollback:** See Rollback Procedure section above

---

## 📅 Timeline Estimate

| Phase                 | Duration      | Notes                |
| --------------------- | ------------- | -------------------- |
| 001 - Consolidate     | 5 min         | Automated            |
| 002 - Migrate Subs    | 10 min        | Automated            |
| 003 - Migrate Details | 15 min        | 5 min manual mapping |
| 004 - Validate        | 5 min         | Automated            |
| Phase 3 - Code        | 2-4 hours     | Code review needed   |
| Phase 4 - Frontend    | 1-2 hours     | Testing included     |
| **Total**             | **4-6 hours** | Including testing    |

---

## 🎉 Success Criteria

✓ Migration is **successful** when:

1. All SQL scripts execute without errors
2. Validation script shows all checks passing
3. Application builds and runs
4. No new data is using legacy Suscripcion tables
5. All tests pass (unit + integration + E2E)
6. User acceptance testing passes
7. 2+ weeks in production with 0 critical bugs

---

**Document Version:** 1.0
**Last Updated:** 2026-01-19
**Status:** Ready for Execution
**Approved By:** [Your Name]
