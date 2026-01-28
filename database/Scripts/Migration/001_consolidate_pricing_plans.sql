-- ============================================================================
-- Script: Consolidate Existing Subscriptions into PricingPlan
-- Purpose: Analyze current Suscripcion data and create corresponding PricingPlans
-- Date: 2026-01-19
-- ============================================================================

-- STEP 1: Analyze current subscription landscape
-- ============================================================================
PRINT '=== STEP 1: Analyzing Current Subscription Data ==='

-- View existing subscription types and their usage
SELECT
    st.Id as SubscriptionTypeId,
    st.Code,
    st.Name as SubscriptionTypeName,
    st.Duration as DurationDays,
    st.Quantity,
    COUNT(DISTINCT s.Id) as ActiveSubscriptions,
    COUNT(DISTINCT s.CompanyId) as UniqueCompanies,
    AVG(CAST(s.Cost as FLOAT)) as AvgCost,
    MIN(s.Cost) as MinCost,
    MAX(s.Cost) as MaxCost,
    AVG(CAST(s.Tax as FLOAT)) as AvgTax,
    AVG(CAST(s.Discount as FLOAT)) as AvgDiscount,
    COUNT(CASE WHEN s.Paid = 1 THEN 1 END) as PaidCount,
    COUNT(CASE WHEN s.Paid = 0 THEN 1 END) as UnpaidCount
INTO #SubscriptionAnalysis
FROM Config.SubscriptionType st WITH (NOLOCK)
LEFT JOIN Sales.Suscripcion s WITH (NOLOCK) ON st.Id = s.SubscriptionTypeId AND s.IsActive = 1
WHERE st.IsActive = 1 AND st.IsDeleted = 0
GROUP BY st.Id, st.Code, st.Name, st.Duration, st.Quantity;

SELECT * FROM #SubscriptionAnalysis;

-- View subscription details distribution
SELECT
    'SuscripcionDetalle Analysis' as AnalysisType,
    COUNT(*) as TotalDetails,
    COUNT(DISTINCT sd.SuscripcionId) as UniqueSuscripciones,
    COUNT(DISTINCT sd.LicenciaDetalleId) as UniqueLicenseDetails,
    AVG(CAST(sd.Cost as FLOAT)) as AvgDetailCost,
    MIN(sd.Cost) as MinDetailCost,
    MAX(sd.Cost) as MaxDetailCost
FROM Sales.SuscripcionDetalle sd WITH (NOLOCK)
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- STEP 2: Create mapping table for Plan consolidation
-- ============================================================================
PRINT '=== STEP 2: Creating PricingPlan Consolidation Mapping ==='

-- For each SubscriptionType, we'll create ONE corresponding PricingPlan
-- This represents the base plan that suscripciones can migrate to
CREATE TABLE #PricingPlanMap (
    SourceSubscriptionTypeId INT,
    SourceSubscriptionCode VARCHAR(5),
    SourceSubscriptionName NVARCHAR(300),

    -- New PricingPlan attributes
    NewPricingPlanCode VARCHAR(25),
    NewPricingPlanName NVARCHAR(100),
    NewDescription NVARCHAR(500),

    -- Financial
    BasePrice NUMERIC(18,5),
    TaxRate NUMERIC(5,2),
    DiscountRate NUMERIC(5,2),

    -- Trial
    IsTrial BIT,
    TrialDays INT,
    RequireCreditCardForTrial BIT,
    AutoConvertToPaid BIT,
    MaxTrialExtensions INT,

    -- Consumption
    IsConsumptionBased BIT,
    ConsumptionModel VARCHAR(50),
    AllowOverage BIT,
    OverageRate NUMERIC(18,5),

    -- Status
    IsCustomPlan BIT,

    NewPricingPlanId INT NULL  -- Will be populated after INSERT
);

-- Populate mapping table from existing subscriptions
INSERT INTO #PricingPlanMap (
    SourceSubscriptionTypeId,
    SourceSubscriptionCode,
    SourceSubscriptionName,
    NewPricingPlanCode,
    NewPricingPlanName,
    NewDescription,
    BasePrice,
    TaxRate,
    DiscountRate,
    IsTrial,
    TrialDays,
    RequireCreditCardForTrial,
    AutoConvertToPaid,
    MaxTrialExtensions,
    IsConsumptionBased,
    ConsumptionModel,
    AllowOverage,
    OverageRate,
    IsCustomPlan
)
SELECT
    sa.SubscriptionTypeId,
    sa.Code,
    sa.SubscriptionTypeName,

    -- Generate new plan code (prefix + old code)
    'MIGR_' + sa.Code as NewPricingPlanCode,

    -- Generate new plan name
    'Migrated: ' + sa.SubscriptionTypeName as NewPricingPlanName,

    -- Description with analysis
    'Consolidated from SubscriptionType ' + CAST(sa.SubscriptionTypeId as VARCHAR) +
    '. ' + CAST(sa.ActiveSubscriptions as VARCHAR) + ' active suscripciones. ' +
    'Avg Cost: $' + CAST(ROUND(sa.AvgCost, 2) as VARCHAR) +
    ' (Range: $' + CAST(ROUND(sa.MinCost, 2) as VARCHAR) +
    ' - $' + CAST(ROUND(sa.MaxCost, 2) as VARCHAR) + ')' as NewDescription,

    -- Use average cost as base (could be adjusted)
    ROUND(ISNULL(sa.AvgCost, 0), 5) as BasePrice,

    -- Calculate average tax rate from existing suscripciones
    CASE
        WHEN ISNULL(sa.AvgCost, 0) > 0
        THEN ROUND((ISNULL(sa.AvgTax, 0) / NULLIF(sa.AvgCost, 0)) * 100, 2)
        ELSE 0
    END as TaxRate,

    -- Calculate average discount rate
    CASE
        WHEN ISNULL(sa.AvgCost, 0) > 0
        THEN ROUND((ISNULL(sa.AvgDiscount, 0) / NULLIF(sa.AvgCost, 0)) * 100, 2)
        ELSE 0
    END as DiscountRate,

    -- Default values (can be customized)
    0 as IsTrial,
    NULL as TrialDays,
    0 as RequireCreditCardForTrial,
    1 as AutoConvertToPaid,
    0 as MaxTrialExtensions,
    0 as IsConsumptionBased,
    NULL as ConsumptionModel,
    0 as AllowOverage,
    NULL as OverageRate,
    0 as IsCustomPlan

FROM #SubscriptionAnalysis sa;

SELECT * FROM #PricingPlanMap;

-- STEP 3: Create actual PricingPlans in database
-- ============================================================================
PRINT '=== STEP 3: Creating PricingPlans from mapping ==='

-- Check if plans already exist
SELECT * FROM Sales.PricingPlan pp
WHERE pp.Code LIKE 'MIGR_%'
AND pp.IsActive = 1 AND pp.IsDeleted = 0;

-- Insert new pricing plans (if not already exist)
INSERT INTO Sales.PricingPlan (
    Code, Name, Description,
    LicenseTypeId, SubscriptionTypeId,
    BasePrice, TaxRate, DiscountRate,
    IsTrial, TrialDays, RequireCreditCardForTrial, AutoConvertToPaid, MaxTrialExtensions,
    IsConsumptionBased, ConsumptionModel, AllowOverage, OverageRate,
    IsCustomPlan,
    IsActive, IsDeleted, CreatedAt
)
SELECT
    ppm.NewPricingPlanCode,
    ppm.NewPricingPlanName,
    ppm.NewDescription,
    1 as LicenseTypeId,  -- ⚠️ Default, adjust as needed
    ppm.SourceSubscriptionTypeId,
    ppm.BasePrice,
    ppm.TaxRate,
    ppm.DiscountRate,
    ppm.IsTrial,
    ppm.TrialDays,
    ppm.RequireCreditCardForTrial,
    ppm.AutoConvertToPaid,
    ppm.MaxTrialExtensions,
    ppm.IsConsumptionBased,
    ppm.ConsumptionModel,
    ppm.AllowOverage,
    ppm.OverageRate,
    ppm.IsCustomPlan,
    1 as IsActive,
    0 as IsDeleted,
    GETUTCDATE() as CreatedAt
FROM #PricingPlanMap ppm
WHERE NOT EXISTS (
    SELECT 1 FROM Sales.PricingPlan pp
    WHERE pp.Code = ppm.NewPricingPlanCode
)
ORDER BY ppm.SourceSubscriptionTypeId;

-- Update mapping table with new IDs
UPDATE ppm
SET ppm.NewPricingPlanId = pp.Id
FROM #PricingPlanMap ppm
INNER JOIN Sales.PricingPlan pp ON pp.Code = ppm.NewPricingPlanCode;

-- STEP 4: Consolidate SuscripcionDetalle into PricingPlanFeatures (optional)
-- ============================================================================
PRINT '=== STEP 4: Analyzing SuscripcionDetalle for features ==='

-- Analyze what "features" are being subscribed (via LicenciaDetalleId)
SELECT
    sd.LicenciaDetalleId,
    COUNT(*) as FrequencyInDetails,
    COUNT(DISTINCT sd.SuscripcionId) as UniqueSuscripciones,
    AVG(CAST(sd.Cost as FLOAT)) as AvgFeatureCost,
    MIN(sd.Cost) as MinFeatureCost,
    MAX(sd.Cost) as MaxFeatureCost
INTO #FeatureUsageAnalysis
FROM Sales.SuscripcionDetalle sd WITH (NOLOCK)
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0
GROUP BY sd.LicenciaDetalleId;

SELECT * FROM #FeatureUsageAnalysis
ORDER BY FrequencyInDetails DESC;

-- STEP 5: Summary for manual verification
-- ============================================================================
PRINT '=== STEP 5: Migration Summary ==='

SELECT
    'Created' as Action,
    COUNT(*) as Count,
    'PricingPlans' as TargetEntity
FROM Sales.PricingPlan pp
WHERE pp.Code LIKE 'MIGR_%'
UNION ALL
SELECT
    'To Migrate' as Action,
    COUNT(*) as Count,
    'Suscripciones' as TargetEntity
FROM Sales.Suscripcion s
WHERE s.IsActive = 1 AND s.IsDeleted = 0
UNION ALL
SELECT
    'To Migrate' as Action,
    COUNT(*) as Count,
    'SuscripcionDetalles' as TargetEntity
FROM Sales.SuscripcionDetalle sd
WHERE sd.IsActive = 1 AND sd.IsDeleted = 0;

-- STEP 6: Cleanup temp tables
-- ============================================================================
DROP TABLE #SubscriptionAnalysis;
DROP TABLE #PricingPlanMap;
DROP TABLE #FeatureUsageAnalysis;

PRINT '=== Migration preparation complete ===';
