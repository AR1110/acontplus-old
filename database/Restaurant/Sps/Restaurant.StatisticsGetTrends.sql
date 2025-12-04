USE Acontplus;
GO
-- =============================================
-- Author:		System
-- Create date: 2025-12-04
-- Description:	Comprehensive trend analysis with forecasting patterns
-- Parameters:	@Filters (JSON from FilterQuery), @SearchTerm
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.StatisticsGetTrends
    @Filters VARCHAR(MAX) = NULL,
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Parse filters from JSON using OPENJSON
    DECLARE @Metric NVARCHAR(50);
    DECLARE @StartDate DATETIME2;
    DECLARE @EndDate DATETIME2;
    DECLARE @GroupBy NVARCHAR(50);
    DECLARE @EstablecimientoId INT;
    DECLARE @UserRoleId INT;
    DECLARE @UserId INT;
    DECLARE @CompanyId INT;

    IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
    BEGIN
        SELECT
            @Metric = Metric,
            @StartDate = TRY_CONVERT(DATETIME2, StartDate),
            @EndDate = TRY_CONVERT(DATETIME2, EndDate),
            @GroupBy = GroupBy,
            @EstablecimientoId = TRY_CONVERT(INT, EstablecimientoId),
            @UserRoleId = TRY_CONVERT(INT, UserRoleId)
        FROM OPENJSON(@Filters)
        WITH (
            Metric NVARCHAR(50),
            StartDate VARCHAR(50),
            EndDate VARCHAR(50),
            GroupBy NVARCHAR(50),
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
    SET @Metric = LOWER(ISNULL(@Metric, 'revenue'));
    SET @GroupBy = LOWER(ISNULL(@GroupBy, 'day'));

    ;WITH TimeSeries AS (
        SELECT
            CASE @GroupBy
                WHEN 'hour' THEN DATEADD(HOUR, DATEDIFF(HOUR, 0, o.CreatedAt), 0)
                WHEN 'day' THEN CAST(o.CreatedAt AS DATE)
                ELSE CAST(o.CreatedAt AS DATE)
            END AS [Date],
            DATEPART(WEEKDAY, o.CreatedAt) AS DayOfWeek,
            DATEPART(HOUR, o.CreatedAt) AS [Hour],
            CASE WHEN DATEPART(WEEKDAY, o.CreatedAt) IN (1, 7) THEN 1 ELSE 0 END AS IsWeekend,
            o.Total,
            o.Id AS OrderId,
            od.Quantity
        FROM Restaurant.[Order] o
        INNER JOIN dbo.PuntoEmision pe ON o.PuntoEmisionId = pe.idPuntoEmision
        LEFT JOIN Restaurant.OrderDetail od ON o.Id = od.OrderId AND od.IsDeleted = 0
        WHERE o.CreatedAt BETWEEN @StartDate AND @EndDate
            AND o.IsDeleted = 0
            AND (@EstablecimientoId IS NULL OR pe.idEstablecimiento = @EstablecimientoId)
    ),
    Aggregated AS (
        SELECT
            [Date],
            CASE @Metric
                WHEN 'revenue' THEN SUM(Total)
                WHEN 'orders' THEN COUNT(DISTINCT OrderId)
                WHEN 'items' THEN SUM(Quantity)
                ELSE SUM(Total)
            END AS [Value],
            AVG(CASE @Metric
                WHEN 'revenue' THEN Total
                WHEN 'items' THEN Quantity
                ELSE Total
            END) AS AvgValue,
            DayOfWeek,
            [Hour],
            MAX(IsWeekend) AS IsWeekend
        FROM TimeSeries
        GROUP BY [Date], DayOfWeek, [Hour]
    ),
    PeriodStats AS (
        SELECT
            AVG([Value]) AS PeriodAverage,
            STDEV([Value]) AS PeriodStdDev,
            MIN([Value]) AS PeriodMin,
            MAX([Value]) AS PeriodMax
        FROM Aggregated
    ),
    Comparisons AS (
        SELECT
            a.[Date],
            a.[Value],
            a.AvgValue,
            LAG(a.[Value], 1) OVER (ORDER BY a.[Date]) AS PreviousValue,
            LAG(a.[Value], 7) OVER (ORDER BY a.[Date]) AS SameWeekdayLastWeek,
            ps.PeriodAverage,
            ps.PeriodStdDev,
            ps.PeriodMin,
            ps.PeriodMax,
            CASE
                WHEN LAG(a.[Value], 1) OVER (ORDER BY a.[Date]) IS NULL THEN 0
                WHEN LAG(a.[Value], 1) OVER (ORDER BY a.[Date]) = 0 THEN 0
                ELSE CAST((a.[Value] - LAG(a.[Value], 1) OVER (ORDER BY a.[Date])) * 100.0 / LAG(a.[Value], 1) OVER (ORDER BY a.[Date]) AS DECIMAL(10,2))
            END AS DayOverDayChange,
            CASE
                WHEN LAG(a.[Value], 7) OVER (ORDER BY a.[Date]) IS NULL THEN 0
                WHEN LAG(a.[Value], 7) OVER (ORDER BY a.[Date]) = 0 THEN 0
                ELSE CAST((a.[Value] - LAG(a.[Value], 7) OVER (ORDER BY a.[Date])) * 100.0 / LAG(a.[Value], 7) OVER (ORDER BY a.[Date]) AS DECIMAL(10,2))
            END AS WeekOverWeekChange,
            a.DayOfWeek,
            a.[Hour],
            a.IsWeekend
        FROM Aggregated a
        CROSS JOIN PeriodStats ps
    )

    -- Return trend analysis with forecasting indicators
    SELECT
        -- === BASE: TEMPORAL CONTEXT ===
        CAST([Date] AS DATETIME2) AS [Date],
        FORMAT([Date], 'yyyy-MM-dd') AS DateLabel,
        DayOfWeek,
        [Hour],
        IsWeekend,
        CAST(0 AS BIT) AS IsHoliday,

        -- === BASE: METRIC VALUES ===
        @Metric AS Metric,
        CAST([Value] AS DECIMAL(18,2)) AS [Value],
        NULL AS Target,
        NULL AS Forecast,

        -- === BASE: MOVING AVERAGES ===
        NULL AS MovingAverage7,
        NULL AS MovingAverage30,
        NULL AS MovingAverage90,

        -- === BASE: CHANGE METRICS ===
        CAST(DayOverDayChange AS DECIMAL(10,2)) AS ChangePercent,
        CASE WHEN PreviousValue > 0
            THEN CAST([Value] - PreviousValue AS DECIMAL(18,2))
            ELSE NULL
        END AS ChangeAbsolute,
        CASE
            WHEN [Value] > PreviousValue THEN 'up'
            WHEN [Value] < PreviousValue THEN 'down'
            ELSE 'stable'
        END AS TrendDirection,
        CAST(ISNULL(PeriodStdDev, 0) AS DECIMAL(18,2)) AS Volatility,

        -- === BASE: COMPARATIVE METRICS ===
        CAST(ISNULL(SameWeekdayLastWeek, 0) AS DECIMAL(18,2)) AS SamePeriodLastWeek,
        NULL AS SamePeriodLastMonth,
        NULL AS SamePeriodLastYear,
        CAST(PeriodAverage AS DECIMAL(18,2)) AS PeriodAverage,
        CASE WHEN PeriodAverage > 0
            THEN CAST(([Value] * 100.0 / PeriodAverage) AS DECIMAL(10,2))
            ELSE NULL
        END AS PercentOfPeriodAvg,

        -- === BASE: LABELS & CATEGORIZATION ===
        NULL AS Label,
        CASE
            WHEN [Value] > PeriodAverage * 1.2 THEN 'high'
            WHEN [Value] < PeriodAverage * 0.8 THEN 'low'
            ELSE 'normal'
        END AS Category,

        -- === BASE: ANOMALY DETECTION ===
        CASE
            WHEN PeriodStdDev > 0 AND ABS([Value] - PeriodAverage) > 2 * PeriodStdDev
            THEN 1
            ELSE 0
        END AS IsAnomaly,
        CASE WHEN PeriodAverage > 0
            THEN CAST(ABS([Value] - PeriodAverage) / PeriodAverage AS DECIMAL(10,2))
            ELSE 0
        END AS AnomalyScore,
        NULL AS Notes,
        NULL AS Metadata,
        NULL AS Labels
    FROM Comparisons
    ORDER BY [Date];

    END TRY
    BEGIN CATCH
        -- Error handling variables
        DECLARE @ErrorNumber INT = ERROR_NUMBER();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @ErrorProcedure NVARCHAR(128) = 'Restaurant.StatisticsGetTrends';
        DECLARE @ErrorLine INT = ERROR_LINE();
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();

        -- Log error to system table
        INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES
            (NEWID(), '/ApiRestaurant/Statistics/Trends', @ErrorNumber, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine, @ErrorMessage, GETDATE(), @UserId);

        -- Re-throw the error
        THROW;
    END CATCH
END;
GO
