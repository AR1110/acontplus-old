USE Acontplus;
GO
-- =============================================
-- Author:		System
-- Create date: 2025-12-04
-- Description:	Time-series aggregated statistics with comprehensive analytics
-- Parameters:	@Filters (JSON from FilterQuery), @SearchTerm
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.StatisticsGetAggregated
    @Filters VARCHAR(MAX) = NULL,
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Parse filters from JSON using OPENJSON
    DECLARE @StartDate DATETIME2;
    DECLARE @EndDate DATETIME2;
    DECLARE @GroupBy NVARCHAR(50);
    DECLARE @MetricType NVARCHAR(50);
    DECLARE @Category NVARCHAR(100);
    DECLARE @EstablecimientoId INT;
    DECLARE @UserRoleId INT;
    DECLARE @UserId INT;
    DECLARE @CompanyId INT;

    IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
    BEGIN
        SELECT
            @StartDate = TRY_CONVERT(DATETIME2, StartDate),
            @EndDate = TRY_CONVERT(DATETIME2, EndDate),
            @GroupBy = GroupBy,
            @MetricType = MetricType,
            @Category = Category,
            @EstablecimientoId = TRY_CONVERT(INT, EstablecimientoId),
            @UserRoleId = TRY_CONVERT(INT, UserRoleId)
        FROM OPENJSON(@Filters)
        WITH (
            StartDate VARCHAR(50),
            EndDate VARCHAR(50),
            GroupBy NVARCHAR(50),
            MetricType NVARCHAR(50),
            Category NVARCHAR(100),
            EstablecimientoId INT,
            UserRoleId INT
        );
    END

    -- Get UserId and CompanyId from UserRoleId
    SELECT @UserId = idUsuario, @CompanyId = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @UserRoleId;

    BEGIN TRY

    SET @StartDate = ISNULL(@StartDate, DATEADD(DAY, -30, GETUTCDATE()));
    SET @EndDate = ISNULL(@EndDate, GETUTCDATE());
    SET @GroupBy = LOWER(ISNULL(@GroupBy, 'day'));
    SET @MetricType = LOWER(ISNULL(@MetricType, 'revenue'));

    -- Calculate previous period for comparison
    DECLARE @PeriodDays INT = DATEDIFF(DAY, @StartDate, @EndDate);
    DECLARE @PrevStartDate DATETIME2 = DATEADD(DAY, -@PeriodDays, @StartDate);
    DECLARE @PrevEndDate DATETIME2 = @StartDate;

    ;WITH TimeSeries AS (
        SELECT
            CASE @GroupBy
                WHEN 'hour' THEN DATEADD(HOUR, DATEDIFF(HOUR, 0, o.CreatedAt), 0)
                WHEN 'day' THEN CAST(o.CreatedAt AS DATE)
                WHEN 'week' THEN DATEADD(DAY, -(DATEPART(WEEKDAY, o.CreatedAt) - 1), CAST(o.CreatedAt AS DATE))
                WHEN 'month' THEN DATEADD(MONTH, DATEDIFF(MONTH, 0, o.CreatedAt), 0)
                ELSE CAST(o.CreatedAt AS DATE)
            END AS Period,
            o.Total,
            o.Id AS OrderId,
            od.Quantity,
            od.Total AS ItemTotal,
            o.CustomerCompanyId
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        LEFT JOIN Restaurant.OrderDetail od ON o.Id = od.OrderId AND od.IsDeleted = 0
        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    Aggregated AS (
        SELECT
            Period,
            CASE @MetricType
                WHEN 'revenue' THEN SUM(Total)
                WHEN 'orders' THEN COUNT(DISTINCT OrderId)
                WHEN 'items' THEN SUM(Quantity)
                WHEN 'customers' THEN COUNT(DISTINCT CustomerCompanyId)
                ELSE SUM(Total)
            END AS [Value],
            MIN(CASE @MetricType
                WHEN 'revenue' THEN Total
                WHEN 'items' THEN Quantity
                ELSE Total
            END) AS MinValue,
            MAX(CASE @MetricType
                WHEN 'revenue' THEN Total
                WHEN 'items' THEN Quantity
                ELSE Total
            END) AS MaxValue,
            AVG(CASE @MetricType
                WHEN 'revenue' THEN Total
                WHEN 'items' THEN Quantity
                ELSE Total
            END) AS AvgValue,
            COUNT(*) AS [Count],
            SUM(CASE @MetricType
                WHEN 'revenue' THEN Total
                WHEN 'items' THEN Quantity
                ELSE Total
            END) AS [Sum],
            @MetricType AS Metric
        FROM TimeSeries
        GROUP BY Period
    ),
    PreviousAgg AS (
        SELECT
            CASE @GroupBy
                WHEN 'hour' THEN DATEADD(HOUR, DATEDIFF(HOUR, 0, o.CreatedAt), 0)
                WHEN 'day' THEN CAST(o.CreatedAt AS DATE)
                WHEN 'week' THEN DATEADD(DAY, -(DATEPART(WEEKDAY, o.CreatedAt) - 1), CAST(o.CreatedAt AS DATE))
                WHEN 'month' THEN DATEADD(MONTH, DATEDIFF(MONTH, 0, o.CreatedAt), 0)
                ELSE CAST(o.CreatedAt AS DATE)
            END AS Period,
            CASE @MetricType
                WHEN 'revenue' THEN SUM(o.Total)
                WHEN 'orders' THEN COUNT(DISTINCT o.Id)
                WHEN 'items' THEN SUM(od.Quantity)
                WHEN 'customers' THEN COUNT(DISTINCT o.CustomerCompanyId)
                ELSE SUM(o.Total)
            END AS PrevValue
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        LEFT JOIN Restaurant.OrderDetail od ON o.Id = od.OrderId AND od.IsDeleted = 0
        WHERE o.CreatedAt BETWEEN @PrevStartDate AND @PrevEndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
        GROUP BY
            CASE @GroupBy
                WHEN 'hour' THEN DATEADD(HOUR, DATEDIFF(HOUR, 0, o.CreatedAt), 0)
                WHEN 'day' THEN CAST(o.CreatedAt AS DATE)
                WHEN 'week' THEN DATEADD(DAY, -(DATEPART(WEEKDAY, o.CreatedAt) - 1), CAST(o.CreatedAt AS DATE))
                WHEN 'month' THEN DATEADD(MONTH, DATEDIFF(MONTH, 0, o.CreatedAt), 0)
                ELSE CAST(o.CreatedAt AS DATE)
            END
    )

    -- Return aggregated statistics with comparisons
    SELECT
        CAST(a.Period AS DATETIME2) AS Period,
        @GroupBy AS GroupBy,
        a.Metric,
        @Category AS Category,
        NULL AS SubCategory,
        CAST(a.[Value] AS DECIMAL(18,2)) AS [Value],
        CAST(a.MinValue AS DECIMAL(18,2)) AS MinValue,
        CAST(a.MaxValue AS DECIMAL(18,2)) AS MaxValue,
        CAST(a.AvgValue AS DECIMAL(18,2)) AS AvgValue,
        a.[Count],
        CAST(a.[Sum] AS DECIMAL(18,2)) AS [Sum],
        CAST(ISNULL(pa.PrevValue, 0) AS DECIMAL(18,2)) AS PreviousPeriodValue,
        CASE WHEN pa.PrevValue > 0
            THEN CAST((a.[Value] - pa.PrevValue) * 100.0 / pa.PrevValue AS DECIMAL(10,2))
            ELSE NULL
        END AS ChangePercent,
        CAST(a.[Value] - ISNULL(pa.PrevValue, 0) AS DECIMAL(18,2)) AS ChangeAbsolute,
        CASE
            WHEN a.[Value] > ISNULL(pa.PrevValue, 0) * 1.05 THEN 'up'
            WHEN a.[Value] < ISNULL(pa.PrevValue, 0) * 0.95 THEN 'down'
            ELSE 'stable'
        END AS Trend,
        NULL AS Percentile25,
        NULL AS Percentile50,
        NULL AS Percentile75,
        NULL AS StandardDeviation
    FROM Aggregated a
    LEFT JOIN PreviousAgg pa ON a.Period = pa.Period
    ORDER BY a.Period;

    END TRY
    BEGIN CATCH
        -- Error handling variables
        DECLARE @ErrorNumber INT = ERROR_NUMBER();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorProcedure NVARCHAR(128) = 'Restaurant.StatisticsGetAggregated';
        DECLARE @ErrorLine INT = ERROR_LINE();
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();

        -- Log error to system table
        INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES
            (NEWID(), '/ApiRestaurant/Statistics/Aggregated', @ErrorNumber, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, GETDATE(), @UserId);

        -- Re-throw the error
        THROW;
    END CATCH
END;
GO
