USE Acontplus
GO
-- ================================================
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-11-29
-- Description: Improved SP for getting dashboard data
-- =============================================
CREATE OR ALTER PROCEDURE Common.Dashboard_Get 
    @json VARCHAR(MAX),
    @tableNames VARCHAR(500) OUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;

	BEGIN TRY
    -- Initialize table names for output
    SET @tableNames = 'companies,documents,licenses';

    -- Temporary tables for intermediate results (to reduce redundant processing)
    -- We can add indexes to temp tables for faster access during grouping/joining

    -- 1. Fetch Active Companies Data
    -- Adding temporary table to store active companies data for further usage
    DECLARE @ActiveCompanies TABLE (
        CompanyId INT PRIMARY KEY,
        SubscriptionTypeId INT
    );

    INSERT INTO @ActiveCompanies (CompanyId, SubscriptionTypeId)
    SELECT 
        c.Id AS CompanyId, 
        s.SubscriptionTypeId
    FROM 
        Config.Company c WITH(NOLOCK)
    INNER JOIN 
        Sales.Suscripcion s WITH(NOLOCK) ON c.Id = s.CompanyId
    INNER JOIN 
        Config.SubscriptionType st WITH(NOLOCK) ON s.SubscriptionTypeId = st.Id
    WHERE 
        s.[IsActive] = 1 
        AND s.IsDeleted = CAST(0 AS BIT) 
        AND s.MaxPaymentDate >= GETDATE() 
        AND c.IsDeleted = CAST(0 AS BIT) 
        AND c.[IsActive] = 1

    -- Total Companies count
    SELECT 
        COUNT(*) AS totalCompanies 
    FROM 
        @ActiveCompanies;

    -- 2. Fetch Document Counts Grouped by Type
    -- Using a CTE to avoid redundant data scans
    WITH DocumentStats AS (
        SELECT 
            de.idTipoDocumento, 
            td.descripcion, 
            td.codigoSri
        FROM 
            dbo.DocumentoElectronico de WITH(NOLOCK)
        INNER JOIN 
            dbo.TipoDocumento td WITH(NOLOCK) ON de.idTipoDocumento = td.idTipoDocumento
        INNER JOIN 
            FactElect.EstadoServicio es WITH(NOLOCK) ON de.idEstadoServicio = es.idEstadoServicio
        WHERE 
            es.codigo = 4
    )
    SELECT 
        COUNT(*) AS total, 
        ds.descripcion AS comprobante
    FROM 
        DocumentStats ds
    GROUP BY 
        ds.idTipoDocumento, ds.descripcion, ds.codigoSri
    ORDER BY 
        ds.codigoSri;

    -- 3. Fetch Licenses Data
    -- Filtering only active companies and subscriptions from @ActiveCompanies temp table
    SELECT 
        lt.[Name] AS license, 
        COUNT(*) AS total
    FROM 
        Config.LicenseType lt WITH(NOLOCK)
    INNER JOIN 
        Config.Licencia l WITH(NOLOCK) ON lt.Id = l.LicenseTypeId
    INNER JOIN 
        Config.LicenciaDetalle ld WITH(NOLOCK) ON l.Id = ld.LicenciaId
    INNER JOIN 
        Sales.SuscripcionDetalle sd WITH(NOLOCK) ON ld.Id = sd.LicenciaDetalleId
    INNER JOIN 
        Sales.Suscripcion s WITH(NOLOCK) ON sd.SuscripcionId = s.Id
    INNER JOIN 
        @ActiveCompanies ac ON ac.CompanyId = s.CompanyId
    WHERE 
        s.[IsActive] = 1 
        AND s.IsDeleted = CAST(0 AS BIT) 
        AND s.MaxPaymentDate >= GETDATE()
    GROUP BY 
        lt.Code, lt.Name;
	END TRY
	BEGIN CATCH
		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        EXEC dbo.LogError
            @ModuleName = 'COMMON',
            @BusinessProcess = 'DASHBOARD_GET',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';
		THROW;
	END CATCH
END
GO