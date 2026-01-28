-- ============================================================================
-- Script: Validate Migration Results
-- Purpose: Comprehensive validation of Suscripcion → Subscription migration
-- Date: 2026-01-19
-- ============================================================================

PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║                 MIGRATION VALIDATION REPORT                           ║';
PRINT '║                    ' + CONVERT(VARCHAR, GETUTCDATE(), 121) + '                 ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';

-- SECTION 1: Row count verification
-- ============================================================================
PRINT '';
PRINT '=== SECTION 1: Row Count Verification ===';

DECLARE @LegacySuscripciones INT = (SELECT COUNT(*) FROM Sales.Suscripcion WHERE IsActive = 1);
DECLARE @LegacyDetalles INT = (SELECT COUNT(*) FROM Sales.SuscripcionDetalle WHERE IsActive = 1);
DECLARE @NewSubscriptions INT = (SELECT COUNT(*) FROM Sales.Subscription WHERE IsActive = 1 AND CreatedAt >= DATEADD(DAY, -1, GETUTCDATE()));
DECLARE @NewFeatures INT = (SELECT COUNT(*) FROM Sales.SubscriptionFeature WHERE IsActive = 1 AND CreatedAt >= DATEADD(DAY, -1, GETUTCDATE()));
DECLARE @MigratedSuscripciones INT = (SELECT COUNT(*) FROM Sales.MigrationLog_Suscripcion);

SELECT
    'Suscripcion (legacy)' as Entity,
    @LegacySuscripciones as LegacyCount,
    @NewSubscriptions as NewCount,
    @MigratedSuscripciones as MigrationLogCount,
    CASE
        WHEN @MigratedSuscripciones = @LegacySuscripciones THEN '✓ OK'
        WHEN @MigratedSuscripciones = @NewSubscriptions THEN '✓ OK'
        ELSE '⚠ MISMATCH'
    END as Status
UNION ALL
SELECT
    'SuscripcionDetalle (legacy)',
    @LegacyDetalles,
    @NewFeatures,
    NULL,
    CASE
        WHEN @NewFeatures >= @LegacyDetalles * 0.95 THEN '✓ OK (≈95%)'
        WHEN @NewFeatures = 0 AND @LegacyDetalles = 0 THEN '✓ OK (empty)'
        ELSE '⚠ MISMATCH'
    END;

-- SECTION 2: Data integrity - Referential Integrity
-- ============================================================================
PRINT '';
PRINT '=== SECTION 2: Referential Integrity ===';

-- Check orphan subscriptions (no PricingPlan)
SELECT
    COUNT(*) as OrphanSubscriptionsCount
FROM Sales.Subscription s
WHERE s.IsActive = 1
AND NOT EXISTS (SELECT 1 FROM Sales.PricingPlan pp WHERE pp.Id = s.PricingPlanId);

-- Check orphan features (no Subscription or PricingPlanFeature)
SELECT
    COUNT(*) as OrphanFeaturesCount
FROM Sales.SubscriptionFeature sf
WHERE sf.IsActive = 1
AND (
    NOT EXISTS (SELECT 1 FROM Sales.Subscription s WHERE s.Id = sf.SubscriptionId)
    OR NOT EXISTS (SELECT 1 FROM Sales.PricingPlanFeature ppf WHERE ppf.Id = sf.PricingPlanFeatureId)
);

-- SECTION 3: Data completeness
-- ============================================================================
PRINT '';
PRINT '=== SECTION 3: Data Completeness ===';

SELECT
    'Subscription' as Entity,
    'NULL PricingPlanId' as ValidationCheck,
    COUNT(*) as IssueCount,
    CASE WHEN COUNT(*) = 0 THEN '✓ OK' ELSE '⚠ ERROR' END as Status
FROM Sales.Subscription
WHERE PricingPlanId IS NULL AND IsActive = 1
UNION ALL
SELECT
    'Subscription',
    'NULL CompanyId',
    COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓ OK' ELSE '⚠ ERROR' END
FROM Sales.Subscription
WHERE CompanyId IS NULL AND IsActive = 1
UNION ALL
SELECT
    'Subscription',
    'EndDate < StartDate',
    COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓ OK' ELSE '⚠ ERROR' END
FROM Sales.Subscription
WHERE EndDate < StartDate AND IsActive = 1
UNION ALL
SELECT
    'SubscriptionFeature',
    'NULL PricingPlanFeatureId',
    COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓ OK' ELSE '⚠ ERROR' END
FROM Sales.SubscriptionFeature
WHERE PricingPlanFeatureId IS NULL AND IsActive = 1
UNION ALL
SELECT
    'SubscriptionFeature',
    'NULL SubscriptionId',
    COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN '✓ OK' ELSE '⚠ ERROR' END
FROM Sales.SubscriptionFeature
WHERE SubscriptionId IS NULL AND IsActive = 1;

-- SECTION 4: Financial data validation
-- ============================================================================
PRINT '';
PRINT '=== SECTION 4: Financial Data Validation ===';

-- Compare totals between legacy and new
SELECT
    'Cost' as FinancialMetric,
    SUM(ISNULL(s.Cost, 0)) as LegacyTotal,
    SUM(ISNULL(n.Cost, 0)) as NewTotal,
    CAST(SUM(ISNULL(n.Cost, 0)) as NUMERIC(18,2)) /
        NULLIF(SUM(ISNULL(s.Cost, 0)), 0) * 100 as PercentageOfLegacy
FROM Sales.Suscripcion s
LEFT JOIN Sales.Subscription n ON
    n.Id IN (SELECT TargetSubscriptionId FROM Sales.MigrationLog_Suscripcion ml WHERE ml.SourceSuscripcionId = s.Id)
WHERE s.IsActive = 1 AND s.IsDeleted = 0
UNION ALL
SELECT
    'Tax',
    SUM(ISNULL(s.Tax, 0)),
    SUM(ISNULL(n.Tax, 0)),
    CAST(SUM(ISNULL(n.Tax, 0)) as NUMERIC(18,2)) /
        NULLIF(SUM(ISNULL(s.Tax, 0)), 0) * 100
FROM Sales.Suscripcion s
LEFT JOIN Sales.Subscription n ON
    n.Id IN (SELECT TargetSubscriptionId FROM Sales.MigrationLog_Suscripcion ml WHERE ml.SourceSuscripcionId = s.Id)
WHERE s.IsActive = 1 AND s.IsDeleted = 0
UNION ALL
SELECT
    'Total',
    SUM(ISNULL(s.Total, 0)),
    SUM(ISNULL(n.Total, 0)),
    CAST(SUM(ISNULL(n.Total, 0)) as NUMERIC(18,2)) /
        NULLIF(SUM(ISNULL(s.Total, 0)), 0) * 100
FROM Sales.Suscripcion s
LEFT JOIN Sales.Subscription n ON
    n.Id IN (SELECT TargetSubscriptionId FROM Sales.MigrationLog_Suscripcion ml WHERE ml.SourceSuscripcionId = s.Id)
WHERE s.IsActive = 1 AND s.IsDeleted = 0;

-- SECTION 5: Mapping validation
-- ============================================================================
PRINT '';
PRINT '=== SECTION 5: Mapping Validation ===';

-- Check PricingPlan distribution
SELECT
    'PricingPlans used in migration' as ValidationScope,
    COUNT(DISTINCT pp.Id) as UniquePlans,
    COUNT(DISTINCT pp.Code) as UniqueCodesCount,
    COUNT(*) as SubscriptionsMapped
FROM Sales.PricingPlan pp
INNER JOIN Sales.Subscription s ON s.PricingPlanId = pp.Id
WHERE pp.Code LIKE 'MIGR_%'
AND s.CreatedAt >= DATEADD(DAY, -1, GETUTCDATE());

-- Check feature distribution
SELECT
    'Features per Subscription' as Metric,
    MIN(FeatureCount) as MinFeatures,
    MAX(FeatureCount) as MaxFeatures,
    AVG(CAST(FeatureCount as FLOAT)) as AvgFeaturesPerSub
FROM (
    SELECT
        sf.SubscriptionId,
        COUNT(*) as FeatureCount
    FROM Sales.SubscriptionFeature sf
    WHERE sf.IsActive = 1
    AND sf.CreatedAt >= DATEADD(DAY, -1, GETUTCDATE())
    GROUP BY sf.SubscriptionId
) sub;

-- SECTION 6: Date range validation
-- ============================================================================
PRINT '';
PRINT '=== SECTION 6: Date Range Validation ===';

SELECT
    'Date Consistency' as ValidationCheck,
    COUNT(*) as SubscriptionsInRange,
    MIN(s.StartDate) as EarliestStart,
    MAX(s.EndDate) as LatestEnd,
    COUNT(CASE WHEN s.StartDate > s.EndDate THEN 1 END) as InvalidDateRanges
FROM Sales.Subscription s
WHERE s.CreatedAt >= DATEADD(DAY, -1, GETUTCDATE())
AND s.IsActive = 1;

-- SECTION 7: Audit trail
-- ============================================================================
PRINT '';
PRINT '=== SECTION 7: Audit Trail ===';

SELECT
    'CreatedAt' as AuditField,
    MIN(s.CreatedAt) as EarliestTimestamp,
    MAX(s.CreatedAt) as LatestTimestamp,
    DATEDIFF(MINUTE, MIN(s.CreatedAt), MAX(s.CreatedAt)) as DurationMinutes,
    COUNT(*) as RecordCount
FROM Sales.Subscription s
WHERE s.CreatedAt >= DATEADD(DAY, -1, GETUTCDATE())
UNION ALL
SELECT
    'UpdatedAt',
    MIN(s.UpdatedAt),
    MAX(s.UpdatedAt),
    DATEDIFF(MINUTE, MIN(s.UpdatedAt), MAX(s.UpdatedAt)),
    COUNT(*)
FROM Sales.Subscription s
WHERE s.UpdatedAt IS NOT NULL
AND s.UpdatedAt >= DATEADD(DAY, -1, GETUTCDATE());

-- SECTION 8: Migration log summary
-- ============================================================================
PRINT '';
PRINT '=== SECTION 8: Migration Log Summary ===';

SELECT
    Status,
    COUNT(*) as Count,
    COUNT(DISTINCT SourceSuscripcionId) as UniqueSources,
    COUNT(DISTINCT TargetSubscriptionId) as UniqueTargets
FROM Sales.MigrationLog_Suscripcion
GROUP BY Status;

-- SECTION 9: Final recommendation
-- ============================================================================
PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║                    VALIDATION COMPLETE                                ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';

PRINT '';
PRINT 'Review the validation results above.';
PRINT '';
PRINT 'NEXT STEPS:';
PRINT '  ✓ If all validations pass (✓ OK), proceed to application updates';
PRINT '  ⚠ If any ⚠ ERROR or ⚠ MISMATCH found:';
PRINT '    1. Investigate and fix data issues';
PRINT '    2. Re-run this validation script';
PRINT '    3. Do NOT delete legacy tables until fully validated';
PRINT '';
PRINT 'TO ROLLBACK:';
PRINT '  1. Delete from Sales.SubscriptionFeature (if needed)';
PRINT '  2. Delete from Sales.Subscription (if needed)';
PRINT '  3. Delete from Sales.PricingPlan WHERE Code LIKE ''MIGR_%''';
PRINT '  4. Truncate Sales.MigrationLog_Suscripcion';
PRINT '';
