-- ============================================================================
-- Script: Migrate SuscripcionDetalle to SubscriptionFeature
-- Purpose: Map detail lines to features within subscriptions
-- Date: 2026-01-19
-- Prerequisites:
--   1. Run 002_migrate_subscriptions.sql first
--   2. Verify Subscriptions were created
--   3. Have PricingPlanFeatures with ApplicationId mappings
-- ============================================================================

-- STEP 1: Analyze SuscripcionDetalle structure
-- ============================================================================
PRINT '=== STEP 1: Analyzing SuscripcionDetalle data ==='

-- See what LicenciaDetalleIds we have and their frequency
SELECT TOP 20
    sd.LicenciaDetalleId,
    COUNT(*) as Frequency,
    COUNT(DISTINCT sd.SuscripcionId) as UsedInSuscripciones,
    MIN(sd.Cost) as MinCost,
    MAX(sd.Cost) as MaxCost,
    AVG(CAST(sd.Cost as FLOAT)) as AvgCost
INTO #LicenceDetailAnalysis
FROM Sales.SuscripcionDetalle sd WITH (NOLOCK)
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0
GROUP BY sd.LicenciaDetalleId
ORDER BY Frequency DESC;

SELECT * FROM #LicenceDetailAnalysis;

-- STEP 2: Create mapping between LicenciaDetalleId and ApplicationId
-- ============================================================================
PRINT '=== STEP 2: Creating LicenciaDetalle → ApplicationId mapping ==='

-- ⚠️ CRITICAL: This requires manual configuration
-- You need to know what applications correspond to the LicenceDetails
-- For now, we'll create a mapping table that you can fill in

CREATE TABLE #LicenceDetailToApplicationMap (
    LicenciaDetalleId INT PRIMARY KEY,
    ApplicationId INT NULL,
    ApplicationName VARCHAR(100) NULL,
    MappingStatus VARCHAR(50) DEFAULT 'UNMAP PPED', -- UNMAPPED, MANUAL, AUTO
    Notes NVARCHAR(MAX) NULL
);

-- Insert all unique LicenceDetailIds found
INSERT INTO #LicenceDetailToApplicationMap (LicenciaDetalleId)
SELECT DISTINCT LicenciaDetalleId
FROM Sales.SuscripcionDetalle sd
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- Try auto-mapping if there's a pattern (example: matching by some criteria)
-- For now, this is manual - user should fill ApplicationId based on their domain knowledge
SELECT * FROM #LicenceDetailToApplicationMap
ORDER BY LicenciaDetalleId;

PRINT '⚠️  CRITICAL: You must fill ApplicationId in the mapping above before continuing';
PRINT '    Or provide manual mapping of LicenciaDetalleId → Config.Aplicacion.Id';

-- STEP 3: Create staging for SuscripcionDetalle → SubscriptionFeature
-- ============================================================================
PRINT '=== STEP 3: Staging SuscripcionDetalle migration ==='

CREATE TABLE #DetailMigrationStaging (
    SourceDetailId INT,
    SourceSuscripcionId INT,
    SourceLicenciaDetalleId INT,
    TargetSubscriptionId INT,
    TargetApplicationId INT,
    TargetPricingPlanFeatureId INT,

    -- Cost data
    Cost NUMERIC(18,5),
    Tax NUMERIC(18,5),
    Discount NUMERIC(18,5),
    Total NUMERIC(18,5),

    -- Dates (semantic change: from StartDate/EndDate to ActivatedAt/DeactivatedAt)
    ActivatedAt DATETIME2,
    DeactivatedAt DATETIME2,

    -- Status
    MigrationStatus VARCHAR(50),
    ErrorMessage NVARCHAR(MAX) NULL
);

-- Populate staging table
INSERT INTO #DetailMigrationStaging (
    SourceDetailId, SourceSuscripcionId, SourceLicenciaDetalleId,
    TargetSubscriptionId, TargetApplicationId,
    Cost, Tax, Discount, Total, ActivatedAt, DeactivatedAt,
    MigrationStatus
)
SELECT
    sd.Id,
    sd.SuscripcionId,
    sd.LicenciaDetalleId,
    ml.TargetSubscriptionId,
    ltam.ApplicationId,
    sd.Cost,
    sd.Tax,
    sd.Discount,
    sd.Total,
    sd.StartDate as ActivatedAt,  -- Semantic: changed from StartDate
    sd.EndDate as DeactivatedAt,    -- Semantic: changed from EndDate
    CASE
        WHEN ltam.ApplicationId IS NULL THEN 'UNMAPPED_APPLICATION'
        WHEN ml.TargetSubscriptionId IS NULL THEN 'ORPHAN_SUBSCRIPTION'
        WHEN ppf.Id IS NULL THEN 'NO_PRICING_PLAN_FEATURE'
        ELSE 'READY'
    END as MigrationStatus
FROM Sales.SuscripcionDetalle sd WITH (NOLOCK)
LEFT JOIN Sales.MigrationLog_Suscripcion ml ON ml.SourceSuscripcionId = sd.SuscripcionId
LEFT JOIN #LicenceDetailToApplicationMap ltam ON ltam.LicenciaDetalleId = sd.LicenciaDetalleId
LEFT JOIN Sales.PricingPlanFeature ppf ON
    ppf.PricingPlanId = ml.TargetPricingPlanId AND
    ppf.ApplicationId = ltam.ApplicationId
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- Review staging
SELECT
    MigrationStatus,
    COUNT(*) as Count
FROM #DetailMigrationStaging
GROUP BY MigrationStatus;

-- Show problematic records
SELECT * FROM #DetailMigrationStaging
WHERE MigrationStatus != 'READY'
ORDER BY MigrationStatus;

-- STEP 4: Create PricingPlanFeatures if needed
-- ============================================================================
PRINT '=== STEP 4: Ensuring PricingPlanFeatures exist ==='

-- For each plan and application combination needed, create feature if missing
INSERT INTO Sales.PricingPlanFeature (
    PricingPlanId, ApplicationId, Quantity, IsRequired, IsAddOn,
    IsActive, IsDeleted, CreatedAt
)
SELECT DISTINCT
    ml.TargetPricingPlanId,
    dms.TargetApplicationId,
    1 as Quantity,
    1 as IsRequired,      -- Default: required
    0 as IsAddOn,         -- Default: not an add-on
    1 as IsActive,
    0 as IsDeleted,
    GETUTCDATE() as CreatedAt
FROM #DetailMigrationStaging dms
INNER JOIN Sales.MigrationLog_Suscripcion ml ON ml.TargetSubscriptionId = dms.TargetSubscriptionId
WHERE dms.MigrationStatus = 'READY'
AND NOT EXISTS (
    SELECT 1 FROM Sales.PricingPlanFeature ppf
    WHERE ppf.PricingPlanId = ml.TargetPricingPlanId
    AND ppf.ApplicationId = dms.TargetApplicationId
);

PRINT 'Created: ' + CAST(@@ROWCOUNT as VARCHAR) + ' PricingPlanFeatures';

-- Update staging with PricingPlanFeatureIds
UPDATE dms
SET dms.TargetPricingPlanFeatureId = ppf.Id
FROM #DetailMigrationStaging dms
INNER JOIN Sales.MigrationLog_Suscripcion ml ON ml.TargetSubscriptionId = dms.TargetSubscriptionId
INNER JOIN Sales.PricingPlanFeature ppf ON
    ppf.PricingPlanId = ml.TargetPricingPlanId AND
    ppf.ApplicationId = dms.TargetApplicationId;

-- STEP 5: Migrate to SubscriptionFeature
-- ============================================================================
PRINT '=== STEP 5: Inserting into Sales.SubscriptionFeature ==='

INSERT INTO Sales.SubscriptionFeature (
    SubscriptionId, PricingPlanFeatureId, Quantity,
    ActivatedAt, DeactivatedAt,
    OverrideCost, OverrideTax, OverrideDiscount, OverrideTotal,
    IsActive, IsDeleted, CreatedAt
)
SELECT
    dms.TargetSubscriptionId,
    dms.TargetPricingPlanFeatureId,
    1 as Quantity,
    dms.ActivatedAt,
    dms.DeactivatedAt,
    dms.Cost as OverrideCost,
    dms.Tax as OverrideTax,
    dms.Discount as OverrideDiscount,
    dms.Total as OverrideTotal,
    1 as IsActive,
    0 as IsDeleted,
    GETUTCDATE() as CreatedAt
FROM #DetailMigrationStaging dms
WHERE dms.MigrationStatus = 'READY'
AND dms.TargetPricingPlanFeatureId IS NOT NULL;

PRINT 'Migrated: ' + CAST(@@ROWCOUNT as VARCHAR) + ' subscription features';

-- STEP 6: Log issues
-- ============================================================================
PRINT '=== STEP 6: Migration Issues Summary ==='

-- Unmapped applications
SELECT
    'UNMAPPED' as IssueType,
    COUNT(*) as Count
FROM #DetailMigrationStaging
WHERE MigrationStatus LIKE 'UNMAPPED%';

-- Orphan subscriptions
SELECT
    'ORPHAN' as IssueType,
    COUNT(*) as Count
FROM #DetailMigrationStaging
WHERE MigrationStatus LIKE 'ORPHAN%';

-- Missing pricing plan features
SELECT
    'MISSING_FEATURE' as IssueType,
    COUNT(*) as Count
FROM #DetailMigrationStaging
WHERE MigrationStatus = 'NO_PRICING_PLAN_FEATURE';

-- STEP 7: Verification
-- ============================================================================
PRINT '=== STEP 7: Verification ==='

SELECT
    'Migrated' as Type,
    COUNT(*) as Count,
    'SubscriptionFeatures' as Entity
FROM Sales.SubscriptionFeature sf
WHERE sf.CreatedAt >= DATEADD(HOUR, -1, GETUTCDATE())  -- Recently created
UNION ALL
SELECT
    'Still pending',
    COUNT(*),
    'SuscripcionDetalles'
FROM Sales.SuscripcionDetalle sd
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- STEP 8: Cleanup
-- ============================================================================
DROP TABLE #LicenceDetailAnalysis;
DROP TABLE #LicenceDetailToApplicationMap;
DROP TABLE #DetailMigrationStaging;

PRINT '=== SuscripcionDetalle migration complete ===';
PRINT '⚠️  ACTION ITEMS:';
PRINT '  1. Review migration issues above (UNMAPPED, ORPHAN, MISSING_FEATURE)';
PRINT '  2. Verify SubscriptionFeatures have correct ApplicationIds';
PRINT '  3. Run validation queries on Subscription + SubscriptionFeature data';
PRINT '  4. Update application code to use new models';
PRINT '  5. Archive legacy tables only after thorough testing';
