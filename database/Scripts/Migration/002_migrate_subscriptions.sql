-- ============================================================================
-- Script: Migrate Suscripcion Data to Subscription
-- Purpose: Move data from legacy Suscripcion/SuscripcionDetalle to new
--          Subscription/SubscriptionFeature tables
-- Date: 2026-01-19
-- Prerequisites:
--   1. Run 001_consolidate_pricing_plans.sql first
--   2. Verify PricingPlans were created
--   3. Have PricingPlanFeatures ready for mapping
-- ============================================================================

-- STEP 1: Verification checks before migration
-- ============================================================================
PRINT '=== STEP 1: Pre-Migration Validation ==='

-- Check if we have PricingPlans to migrate to
IF NOT EXISTS (SELECT 1 FROM Sales.PricingPlan pp WHERE pp.Code LIKE 'MIGR_%')
BEGIN
    RAISERROR('No MIGR_* PricingPlans found. Run 001_consolidate_pricing_plans.sql first.', 16, 1);
END;

-- Check existing subscription count
DECLARE @TotalSuscripciones INT = (
    SELECT COUNT(*) FROM Sales.Suscripcion WHERE IsActive = 1 AND IsDeleted = 0
);
DECLARE @TotalSubscriptions INT = (
    SELECT COUNT(*) FROM Sales.Subscription WHERE IsActive = 1 AND IsDeleted = 0
);

PRINT 'Legacy Suscripciones to migrate: ' + CAST(@TotalSuscripciones as VARCHAR);
PRINT 'Existing Subscriptions: ' + CAST(@TotalSubscriptions as VARCHAR);

-- STEP 2: Create migration staging table
-- ============================================================================
PRINT '=== STEP 2: Creating migration staging table ==='

CREATE TABLE #MigrationStagging (
    SourceSuscripcionId INT,
    SourceSubscriptionTypeId INT,
    SourceCompanyId INT,
    TargetPricingPlanId INT,
    TargetSubscriptionId INT NULL,

    -- Data to migrate
    StartDate DATETIME2,
    EndDate DATETIME2,
    MaxPaymentDate DATETIME2,
    Cost NUMERIC(18,5),
    Tax NUMERIC(18,5),
    Discount NUMERIC(18,5),
    Total NUMERIC(18,5),
    Paid BIT,
    WarningMessage NVARCHAR(1500),

    -- Audit
    CreatedByUserId INT NULL,
    CreatedAt DATETIME2,
    UpdatedAt DATETIME2 NULL,
    IsActive BIT,
    IsDeleted BIT,

    -- Status
    MigrationStatus VARCHAR(50),
    ErrorMessage NVARCHAR(MAX) NULL
);

-- STEP 3: Populate staging with mappings
-- ============================================================================
PRINT '=== STEP 3: Populating migration staging ==='

INSERT INTO #MigrationStagging (
    SourceSuscripcionId, SourceSubscriptionTypeId, SourceCompanyId,
    TargetPricingPlanId, StartDate, EndDate, MaxPaymentDate,
    Cost, Tax, Discount, Total, Paid, WarningMessage,
    CreatedByUserId, CreatedAt, UpdatedAt, IsActive, IsDeleted,
    MigrationStatus
)
SELECT
    s.Id,
    s.SubscriptionTypeId,
    s.CompanyId,
    pp.Id as TargetPricingPlanId,  -- FK to new PricingPlan
    s.StartDate,
    s.EndDate,
    s.MaxPaymentDate,
    s.Cost,
    s.Tax,
    s.Discount,
    s.Total,
    s.Paid,
    s.WarningMessage,
    s.CreatedByUserId,
    s.CreatedAt,
    s.UpdatedAt,
    s.IsActive,
    s.IsDeleted,
    'STAGED' as MigrationStatus
FROM Sales.Suscripcion s WITH (NOLOCK)
INNER JOIN Sales.PricingPlan pp ON pp.Code = 'MIGR_' +
    (SELECT TOP 1 Code FROM Config.SubscriptionType WHERE Id = s.SubscriptionTypeId)
WHERE s.IsActive = 1 AND s.IsDeleted = 0;

PRINT 'Staged: ' + CAST(@@ROWCOUNT as VARCHAR) + ' suscripciones for migration';

-- Check for mapping failures
DECLARE @UnmappedCount INT = (
    SELECT COUNT(*) FROM Sales.Suscripcion s
    WHERE s.IsActive = 1 AND s.IsDeleted = 0
    AND NOT EXISTS (
        SELECT 1 FROM #MigrationStagging ms
        WHERE ms.SourceSuscripcionId = s.Id
    )
);
IF @UnmappedCount > 0
    PRINT '⚠️  WARNING: ' + CAST(@UnmappedCount as VARCHAR) + ' suscripciones could not be mapped to PricingPlans';

-- STEP 4: Migrate to Subscription
-- ============================================================================
PRINT '=== STEP 4: Inserting into Sales.Subscription ==='

INSERT INTO Sales.Subscription (
    PricingPlanId, CompanyId, StartDate, EndDate, MaxPaymentDate,
    Cost, Tax, Discount, Total, Paid,
    IsTrial, AutoRenew, WarningMessage,
    IsActive, IsDeleted, CreatedAt, CreatedByUserId
)
SELECT
    ms.TargetPricingPlanId,
    ms.SourceCompanyId,
    ms.StartDate,
    ms.EndDate,
    ms.MaxPaymentDate,
    ms.Cost,
    ms.Tax,
    ms.Discount,
    ms.Total,
    ISNULL(ms.Paid, 0),
    0 as IsTrial,           -- Legacy subscriptions are not trials
    1 as AutoRenew,         -- Default to auto-renew
    ms.WarningMessage,
    ms.IsActive,
    ms.IsDeleted,
    ms.CreatedAt,
    ms.CreatedByUserId
FROM #MigrationStagging ms;

PRINT 'Inserted: ' + CAST(@@ROWCOUNT as VARCHAR) + ' subscriptions';

-- Update staging with new IDs
UPDATE ms
SET ms.TargetSubscriptionId = s.Id,
    ms.MigrationStatus = 'MIGRATED'
FROM #MigrationStagging ms
INNER JOIN Sales.Subscription s ON
    s.PricingPlanId = ms.TargetPricingPlanId AND
    s.CompanyId = ms.SourceCompanyId AND
    s.StartDate = ms.StartDate AND
    s.EndDate = ms.EndDate;

-- STEP 5: Create mapping table for future reference
-- ============================================================================
PRINT '=== STEP 5: Creating permanent migration log ==='

CREATE TABLE Sales.MigrationLog_Suscripcion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SourceSuscripcionId INT,
    TargetSubscriptionId INT,
    SourceSubscriptionTypeId INT,
    TargetPricingPlanId INT,
    CompanyId INT,
    MigrationDate DATETIME2 DEFAULT GETUTCDATE(),
    Status VARCHAR(50),
    Notes NVARCHAR(MAX) NULL
);

INSERT INTO Sales.MigrationLog_Suscripcion (
    SourceSuscripcionId, TargetSubscriptionId, SourceSubscriptionTypeId,
    TargetPricingPlanId, CompanyId, Status
)
SELECT
    ms.SourceSuscripcionId,
    ms.TargetSubscriptionId,
    ms.SourceSubscriptionTypeId,
    ms.TargetPricingPlanId,
    ms.SourceCompanyId,
    ms.MigrationStatus
FROM #MigrationStagging ms
WHERE ms.MigrationStatus = 'MIGRATED';

-- STEP 6: Summary report
-- ============================================================================
PRINT '=== STEP 6: Migration Summary ==='

SELECT
    'Subscriptions' as Entity,
    COUNT(*) as Count,
    'Migrated' as Status
FROM #MigrationStagging
WHERE MigrationStatus = 'MIGRATED'
UNION ALL
SELECT
    'Subscriptions',
    COUNT(*),
    'Staged but not inserted'
FROM #MigrationStagging
WHERE MigrationStatus = 'STAGED' AND TargetSubscriptionId IS NULL
UNION ALL
SELECT
    'SuscripcionDetalles',
    COUNT(*),
    'Still awaiting migration'
FROM Sales.SuscripcionDetalle sd
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- Check consistency
SELECT
    'Consistency Check' as Type,
    'Suscripciones → Subscriptions' as Direction,
    COUNT(DISTINCT ml.SourceSuscripcionId) as SourceCount,
    COUNT(DISTINCT ml.TargetSubscriptionId) as TargetCount
FROM Sales.MigrationLog_Suscripcion ml;

-- STEP 7: Cleanup
-- ============================================================================
DROP TABLE #MigrationStagging;

PRINT '=== Migration complete. Review results above. ==='
PRINT '⚠️  NEXT STEPS:';
PRINT '  1. Review migration log in Sales.MigrationLog_Suscripcion';
PRINT '  2. Run validation queries to verify data integrity';
PRINT '  3. Handle SuscripcionDetalle → SubscriptionFeature mapping';
PRINT '  4. Test application with new Subscription model';
PRINT '  5. Archive or delete legacy tables only after verification';
