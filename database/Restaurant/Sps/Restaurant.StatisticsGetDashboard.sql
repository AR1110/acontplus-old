USE Acontplus;
GO
-- =============================================
-- Author:		System
-- Create date: 2025-12-04
-- Description:	Comprehensive dashboard statistics for restaurant analytics
-- Parameters:	@Filters (JSON from FilterQuery), @SearchTerm
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.StatisticsGetDashboard
    @Filters VARCHAR(MAX) = NULL,
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Parse filters from JSON using OPENJSON
    DECLARE @StartDate DATETIME2;
    DECLARE @EndDate DATETIME2;
    DECLARE @EstablecimientoId INT;
    DECLARE @UserRoleId INT;
    DECLARE @UserId INT;
    DECLARE @CompanyId INT;

    IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
    BEGIN
        SELECT
            @StartDate = TRY_CONVERT(DATETIME2, StartDate),
            @EndDate = TRY_CONVERT(DATETIME2, EndDate),
            @EstablecimientoId = TRY_CONVERT(INT, EstablecimientoId),
            @UserRoleId = TRY_CONVERT(INT, UserRoleId)
        FROM OPENJSON(@Filters)
        WITH (
            StartDate VARCHAR(50),
            EndDate VARCHAR(50),
            EstablecimientoId INT,
            UserRoleId INT
        );
    END

    -- Get UserId and CompanyId from UserRoleId
    SELECT @UserId = idUsuario, @CompanyId = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @UserRoleId;

    BEGIN TRY

    -- Default to last 30 days if not provided
    SET @StartDate = ISNULL(@StartDate, DATEADD(DAY, -30, GETUTCDATE()));
    SET @EndDate = ISNULL(@EndDate, GETUTCDATE());

    DECLARE @PrevStartDate DATETIME2 = DATEADD(DAY, -DATEDIFF(DAY, @StartDate, @EndDate), @StartDate);
    DECLARE @PrevEndDate DATETIME2 = @StartDate;

    -- Main Statistics
    WITH CurrentPeriod AS (
        SELECT
            COUNT(DISTINCT o.Id) AS TotalOrders,
            COUNT(DISTINCT CASE WHEN o.IsFinished = 1 THEN o.Id END) AS CompletedOrders,
            COUNT(DISTINCT CASE WHEN od.Status = 6 THEN o.Id END) AS CancelledOrders,
            COUNT(DISTINCT CASE WHEN o.IsFinished = 0 THEN o.Id END) AS ActiveOrders,
            ISNULL(SUM(o.Total), 0) AS TotalRevenue,
            ISNULL(SUM(o.Total - ISNULL(od.TaxValue, 0) - ISNULL(o.Discount, 0)), 0) AS NetRevenue,
            ISNULL(SUM(od.TaxValue), 0) AS TotalTax,
            ISNULL(SUM(o.Discount), 0) AS TotalDiscount,
            ISNULL(SUM(o.Tip), 0) AS TotalTips,
            COUNT(DISTINCT o.CustomerCompanyId) AS UniqueCustomers,
            SUM(od.Quantity) AS TotalItemsSold
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision p ON o.PuntoEmisionId = p.idPuntoEmision
        LEFT JOIN Restaurant.OrderDetail od ON o.Id = od.OrderId AND od.IsDeleted = 0
        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR p.idEstablecimiento = @EstablecimientoId)
    ),
    PreviousPeriod AS (
        SELECT
            ISNULL(SUM(o.Total), 0) AS PrevRevenue,
            COUNT(DISTINCT o.Id) AS PrevOrders,
            COUNT(DISTINCT o.CustomerCompanyId) AS PrevCustomers
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        WHERE o.CreatedAt BETWEEN @PrevStartDate AND @PrevEndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    TopItems AS (
        SELECT TOP 1
            p.descripcion AS TopSellingItem,
            SUM(od.Quantity) AS TopSellingQty
        FROM Restaurant.OrderDetail od
        INNER JOIN Restaurant.Item i ON od.ItemId = i.Id
        INNER JOIN dbo.Articulo p ON i.ProductId = p.idArticulo
        INNER JOIN Restaurant.[Order] o ON od.OrderId = o.Id
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND od.IsDeleted = 0
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
        GROUP BY p.descripcion
        ORDER BY SUM(od.Quantity) DESC
    ),
    TopRevenue AS (
        SELECT TOP 1
            p.descripcion AS TopRevenueItem,
            SUM(od.Total) AS TopRevenueTotal
        FROM Restaurant.OrderDetail od
        INNER JOIN Restaurant.Item i ON od.ItemId = i.Id
        INNER JOIN dbo.Articulo p ON i.ProductId = p.idArticulo
        INNER JOIN Restaurant.[Order] o ON od.OrderId = o.Id
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision

        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND od.IsDeleted = 0
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
        GROUP BY p.descripcion
        ORDER BY SUM(od.Total) DESC
    ),
    DocumentStats AS (
        SELECT
            COUNT(DISTINCT od.Id) AS TotalDocs,
            COUNT(DISTINCT CASE WHEN td.codigoSri = '01' THEN od.Id END) AS TotalInvoices,
            COUNT(DISTINCT CASE WHEN td.codigo = 'NE' THEN od.Id END) AS TotalDeliveryNotes,
            COUNT(DISTINCT CASE WHEN td.codigo = 'PR' THEN od.Id END) AS TotalProformas,
            COUNT(DISTINCT CASE WHEN o.IsFinished = 1 AND od.Id IS NOT NULL THEN od.Id END) AS ProcessedDocs,
            COUNT(DISTINCT CASE WHEN o.IsFinished = 0 AND od.Id IS NOT NULL THEN od.Id END) AS PendingDocs
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        LEFT JOIN Restaurant.OrderDocument od ON o.Id = od.OrderId AND od.IsActive = 1
        LEFT JOIN dbo.TipoDocumento td ON od.TipoDocumentoId = td.idTipoDocumento
        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    )

    -- Return comprehensive dashboard metrics
    SELECT
        -- === BASE: TRANSACTION METRICS ===
        cp.TotalOrders AS TotalTransactions,
        cp.CompletedOrders AS CompletedTransactions,
        cp.CancelledOrders AS CancelledTransactions,
        cp.ActiveOrders AS ActiveTransactions,
        CASE WHEN cp.TotalOrders > 0
            THEN CAST(cp.CompletedOrders * 100.0 / cp.TotalOrders AS DECIMAL(10,2))
            ELSE 0
        END AS CompletionRate,

        -- === BASE: REVENUE METRICS ===
        cp.TotalRevenue AS TotalRevenue,
        cp.NetRevenue,
        CASE WHEN cp.TotalOrders > 0
            THEN CAST(cp.TotalRevenue / cp.TotalOrders AS DECIMAL(18,2))
            ELSE 0
        END AS AverageTransactionValue,
        cp.TotalTax AS TotalTax,
        cp.TotalDiscount AS TotalDiscounts,
        CASE WHEN pp.PrevRevenue > 0
            THEN CAST((cp.TotalRevenue - pp.PrevRevenue) * 100.0 / pp.PrevRevenue AS DECIMAL(10,2))
            ELSE 0
        END AS GrowthRate,
        CASE WHEN cp.UniqueCustomers > 0
            THEN CAST(cp.TotalRevenue / cp.UniqueCustomers AS DECIMAL(18,2))
            ELSE 0
        END AS RevenuePerEntity,

        -- === BASE: VOLUME METRICS ===
        cp.TotalItemsSold AS TotalItemsProcessed,
        CASE WHEN cp.TotalOrders > 0
            THEN CAST(cp.TotalItemsSold * 1.0 / cp.TotalOrders AS DECIMAL(10,2))
            ELSE 0
        END AS AverageItemsPerTransaction,
        ISNULL(ti.TopSellingItem, '') AS TopItem,
        ISNULL(ti.TopSellingQty, 0) AS TopItemQuantity,
        ISNULL(tr.TopRevenueItem, '') AS TopRevenueItem,
        ISNULL(tr.TopRevenueTotal, 0) AS TopRevenueItemTotal,

        -- === BASE: ENTITY METRICS (Customers) ===
        cp.UniqueCustomers AS UniqueEntities,
        0 AS NewEntities, -- Requires customer tracking logic
        0 AS ReturningEntities,
        CAST(0.00 AS DECIMAL(10,2)) AS EntityRetentionRate,

        -- === BASE: PERIOD COMPARISON ===
        CASE WHEN pp.PrevRevenue > 0
            THEN CAST((cp.TotalRevenue - pp.PrevRevenue) * 100.0 / pp.PrevRevenue AS DECIMAL(10,2))
            ELSE 0
        END AS RevenueChangePercent,
        CASE WHEN pp.PrevOrders > 0
            THEN CAST((cp.TotalOrders - pp.PrevOrders) * 100.0 / pp.PrevOrders AS DECIMAL(10,2))
            ELSE 0
        END AS TransactionChangePercent,
        CASE WHEN pp.PrevCustomers > 0
            THEN CAST((cp.UniqueCustomers - pp.PrevCustomers) * 100.0 / pp.PrevCustomers AS DECIMAL(10,2))
            ELSE 0
        END AS EntityChangePercent,

        -- === BASE: FINANCIAL BREAKDOWN ===
        CAST(0.00 AS DECIMAL(18,2)) AS CashPayments,
        CAST(0.00 AS DECIMAL(18,2)) AS CardPayments,
        CAST(0.00 AS DECIMAL(18,2)) AS OtherPayments,
        CASE WHEN cp.TotalRevenue > 0
            THEN CAST(cp.TotalDiscount * 100.0 / cp.TotalRevenue AS DECIMAL(10,2))
            ELSE 0
        END AS AverageDiscountPercent,

        -- === RESTAURANT-SPECIFIC: OPERATIONAL METRICS ===
        CAST(0.00 AS DECIMAL(10,2)) AS AveragePreparationTime,
        CAST(0.00 AS DECIMAL(10,2)) AS AverageServiceTime,
        CAST(0.00 AS DECIMAL(10,2)) AS TableTurnoverRate,
        0 AS PeakHourOrders,
        '' AS PeakHourTime,
        cp.TotalTips,

        -- === RESTAURANT-SPECIFIC: DOCUMENT METRICS ===
        ISNULL(ds.TotalInvoices, 0) AS TotalInvoices,
        ISNULL(ds.TotalDeliveryNotes, 0) AS TotalDeliveryNotes,
        ISNULL(ds.TotalProformas, 0) AS TotalProformas,
        CASE WHEN ds.TotalDocs > 0
            THEN CAST(ds.ProcessedDocs * 100.0 / ds.TotalDocs AS DECIMAL(10,2))
            ELSE 0
        END AS DocumentProcessingRate

    FROM CurrentPeriod cp
    CROSS JOIN PreviousPeriod pp
    LEFT JOIN TopItems ti ON 1=1
    LEFT JOIN TopRevenue tr ON 1=1
    LEFT JOIN DocumentStats ds ON 1=1;

    END TRY
    BEGIN CATCH
        -- Error handling variables
        DECLARE @ErrorNumber INT = ERROR_NUMBER();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorProcedure NVARCHAR(128) = 'Restaurant.StatisticsGetDashboard';
        DECLARE @ErrorLine INT = ERROR_LINE();
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();

        -- Log error to system table
        INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES
            (NEWID(), '/ApiRestaurant/Statistics/Dashboard', @ErrorNumber, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, GETDATE(), @UserId);

        -- Re-throw the error
        THROW;
    END CATCH
END;
GO
