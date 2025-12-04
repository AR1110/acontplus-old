USE Acontplus;
GO
-- =============================================
-- Author:		System
-- Create date: 2025-12-04
-- Description:	Comprehensive real-time operational statistics
-- Parameters:	@Filters (JSON from FilterQuery), @SearchTerm
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.StatisticsGetRealTime
    @Filters VARCHAR(MAX) = NULL,
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Parse filters from JSON using OPENJSON
    DECLARE @EstablecimientoId INT;
    DECLARE @UserRoleId INT;
    DECLARE @UserId INT;
    DECLARE @CompanyId INT;

    IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
    BEGIN
        SELECT
            @EstablecimientoId = TRY_CONVERT(INT, EstablecimientoId),
            @UserRoleId = TRY_CONVERT(INT, UserRoleId)
        FROM OPENJSON(@Filters)
        WITH (
            EstablecimientoId INT,
            UserRoleId INT
        );
    END

    -- Get UserId and CompanyId from UserRoleId
    SELECT @UserId = idUsuario, @CompanyId = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @UserRoleId;

    BEGIN TRY

    DECLARE @Now DATETIME2 = GETUTCDATE();
    DECLARE @FiveMinAgo DATETIME2 = DATEADD(MINUTE, -5, @Now);
    DECLARE @FifteenMinAgo DATETIME2 = DATEADD(MINUTE, -15, @Now);
    DECLARE @CurrentHourStart DATETIME2 = DATEADD(HOUR, DATEDIFF(HOUR, 0, @Now), 0);
    DECLARE @TodayStart DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);

    -- Table Status
    WITH TableStats AS (
        SELECT
            COUNT(*) AS TotalTables,
            COUNT(CASE WHEN o.Id IS NOT NULL AND o.IsFinished = 0 THEN 1 END) AS OccupiedTables
        FROM Restaurant.[Table] t
        INNER JOIN Restaurant.Room r ON t.RoomId = r.Id
        INNER JOIN Restaurant.[Floor] f ON r.FloorId = f.Id
        INNER JOIN dbo.PuntoEmision pe ON f.EstablecimientoId = pe.idEstablecimiento
        LEFT JOIN Restaurant.[Order] o ON t.Id = o.TableId
            AND o.IsDeleted = 0 AND o.IsFinished = 0
        WHERE t.IsDeleted = 0 AND t.IsActive = 1
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    OrderStats AS (
        SELECT
            COUNT(DISTINCT CASE WHEN o.IsFinished = 0 THEN o.Id END) AS ActiveOrders,
            COUNT(DISTINCT CASE WHEN od.Status = 1 THEN o.Id END) AS QueuedOrders,
            COUNT(DISTINCT CASE WHEN o.IsFinished = 0 THEN o.Id END) AS PendingPayments,
            COUNT(DISTINCT CASE WHEN o.CreatedAt >= @FiveMinAgo THEN o.Id END) AS RecentOrders,
            COUNT(DISTINCT CASE WHEN o.CreatedAt >= @CurrentHourStart THEN o.Id END) AS OrdersThisHour
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        LEFT JOIN Restaurant.OrderDetail od ON o.Id = od.OrderId AND od.IsDeleted = 0
        WHERE o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    KitchenStats AS (
        SELECT
            COUNT(DISTINCT CASE WHEN od.Status IN (2, 3) THEN od.Id END) AS InKitchen,
            COUNT(DISTINCT CASE WHEN od.Status = 3 THEN od.Id END) AS InPreparation,
            COUNT(DISTINCT CASE WHEN od.Status = 4 THEN od.Id END) AS Ready,
            AVG(CASE WHEN od.Status >= 4
                THEN DATEDIFF(MINUTE, od.CreatedAt, ISNULL(od.UpdatedAt, @Now))
                ELSE NULL
            END) AS AvgPrepTime
        FROM Restaurant.OrderDetail od
        INNER JOIN Restaurant.[Order] o ON od.OrderId = o.Id
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        WHERE od.IsDeleted = 0
            AND o.IsDeleted = 0
            AND od.CreatedAt >= @TodayStart
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    RevenueStats AS (
        SELECT
            ISNULL(SUM(o.Total), 0) AS TodayRevenue,
            ISNULL(SUM(CASE WHEN o.CreatedAt >= @CurrentHourStart THEN o.Total ELSE 0 END), 0) AS ThisHourRevenue,
            ISNULL(SUM(CASE WHEN o.CreatedAt >= @FifteenMinAgo THEN o.Total ELSE 0 END), 0) AS Last15MinRevenue
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        WHERE o.CreatedAt >= @TodayStart
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    PromotionStats AS (
        SELECT
            COUNT(*) AS ActivePromotions,
            COUNT(CASE WHEN p.DiscountPercent = 1 THEN 1 END) AS PercentagePromotions,
            COUNT(CASE WHEN p.DiscountPercent = 2 THEN 1 END) AS FixedPromotions
        FROM Restaurant.Promotion p
        WHERE p.IsActive = 1
            AND p.IsDeleted = 0
            AND @Now BETWEEN p.StartDate AND p.EndDate
            AND (@EstablecimientoId IS NULL OR p.EstablishmentId = @EstablecimientoId)
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
        WHERE o.CreatedAt >= @TodayStart
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    )

    -- Return comprehensive real-time metrics
    SELECT
        -- === BASE: CURRENT OPERATIONS ===
        ts.TotalTables AS TotalResources,
        ts.OccupiedTables AS ActiveResources,
        CASE WHEN ts.TotalTables > 0
            THEN CAST(ts.OccupiedTables * 100.0 / ts.TotalTables AS DECIMAL(10,2))
            ELSE 0
        END AS ResourceUtilization,
        os.ActiveOrders AS ActiveTransactions,
        os.QueuedOrders AS QueuedTransactions,
        os.PendingPayments AS PendingPayments,

        -- === BASE: RECENT ACTIVITY ===
        os.RecentOrders AS RecentTransactions,
        os.OrdersThisHour AS TransactionsThisHour,
        CASE WHEN os.OrdersThisHour > 0
            THEN CAST(os.OrdersThisHour * 60.0 / DATEDIFF(MINUTE, @CurrentHourStart, @Now) AS DECIMAL(10,2))
            ELSE 0
        END AS TransactionsPerHour,
        rs.TodayRevenue AS TodayRevenue,
        rs.ThisHourRevenue AS ThisHourRevenue,
        rs.Last15MinRevenue AS Last15MinRevenue,

        -- === BASE: PROCESSING METRICS ===
        ks.InKitchen AS InProcessing,
        ks.InPreparation AS ActiveProcessing,
        ks.Ready AS ReadyForDelivery,
        ISNULL(ks.AvgPrepTime, 0) AS AverageProcessingTime,
        0 AS OnlineUsers,

        -- === RESTAURANT-SPECIFIC: OPERATIONAL STATUS ===
        ts.OccupiedTables AS OccupiedTables,
        ts.TotalTables - ts.OccupiedTables AS AvailableTables,
        CAST(0.00 AS DECIMAL(10,2)) AS AverageTableDuration,
        ps.ActivePromotions,
        CASE
            WHEN os.OrdersThisHour > 10 THEN 'Busy'
            WHEN os.OrdersThisHour > 5 THEN 'Normal'
            ELSE 'Slow'
        END AS CurrentPeakStatus,

        -- === RESTAURANT-SPECIFIC: DOCUMENT METRICS ===
        ISNULL(ds.TotalInvoices, 0) AS TotalInvoices,
        ISNULL(ds.TotalDeliveryNotes, 0) AS TotalDeliveryNotes,
        ISNULL(ds.TotalProformas, 0) AS TotalProformas,
        ISNULL(ds.ProcessedDocs, 0) AS ProcessedDocuments

    FROM TableStats ts
    CROSS JOIN OrderStats os
    CROSS JOIN KitchenStats ks
    CROSS JOIN RevenueStats rs
    CROSS JOIN PromotionStats ps
    CROSS JOIN DocumentStats ds;

    END TRY
    BEGIN CATCH
        -- Error handling variables
        DECLARE @ErrorNumber INT = ERROR_NUMBER();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorProcedure NVARCHAR(128) = 'Restaurant.StatisticsGetRealTime';
        DECLARE @ErrorLine INT = ERROR_LINE();
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();

        -- Log error to system table
        INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES
            (NEWID(), '/ApiRestaurant/Statistics/RealTime', @ErrorNumber, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, GETDATE(), @UserId);

        -- Re-throw the error
        THROW;
    END CATCH
END;
GO
