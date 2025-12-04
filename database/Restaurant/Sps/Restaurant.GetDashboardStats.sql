USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2025-10-14
-- Description:	SP para listar datos de las ventas para un uso generico
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.GetDashboardStats
    @Filters VARCHAR(MAX) = NULL
   ,@SearchTerm VARCHAR(200) = NULL
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> DataJson
    DECLARE @UserId INT ,@UserRoleId INT ,@EstablishmentId INT;

    --> Data bd
    DECLARE @IdEntidad INT

    --> Variables especiales
    DECLARE @TableNames VARCHAR(MAX)


    --> Tabla Temporal
    CREATE TABLE #DashboardStatsResults
    (
        TableName NVARCHAR(128) NOT NULL
       ,[Value] NVARCHAR(400) NULL DEFAULT ''
       ,[Year]  INT NULL DEFAULT 0
       ,[Month] INT NULL DEFAULT 0
       ,Total NUMERIC(18,2) NULL DEFAULT 0
       ,Quantity INT NULL DEFAULT 0
       ,INDEX IX_Temp_TableName CLUSTERED (TableName,[Year],[Month],Quantity)
    );

    BEGIN TRY
        --> Variables json
        SELECT @UserRoleId      = UserRoleId
              ,@EstablishmentId = EstablishmentId
        FROM OPENJSON(@Filters)
        WITH
        (
            userRoleId      INT
           ,establishmentId INT
        )

        --> Varbiables bd
        SELECT TOP 1 @IdEntidad = idEntidad ,@UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @UserRoleId;

        INSERT INTO #DashboardStatsResults (TableName ,Total ,[Year] ,[Month])
        SELECT 'orders'             as TableName
               ,SUM(ro.Total)       as Total
               ,YEAR(ro.CreatedAt)  as [Year]
               ,MONTH(ro.CreatedAt) as [Month]
        FROM Restaurant.[Order]     ro WITH (NOLOCK)
        INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ro.PuntoEmisionId
        WHERE YEAR(ro.CreatedAt)   = YEAR(GETDATE())
          AND ro.IsActive = 1
          --AND pe.idEstablecimiento = @EstablishmentId
        GROUP BY YEAR(ro.CreatedAt), MONTH(ro.CreatedAt)

        INSERT INTO #DashboardStatsResults (TableName ,[Value] ,Total ,[Year] ,[Month])
        SELECT 'docs'               as TableName
              ,CASE WHEN cc.codDoc = '01' THEN 'Factura'
	                WHEN cc.codDoc = 'NE' THEN 'Nota Entrega'
	                ELSE 'Otro'
	           END				    as Document
	          ,SUM(cc.importeTotal) as Total
	          ,YEAR(od.CreatedAt)   as [Year]
	          ,MONTH(od.CreatedAt)  as [Month]
        FROM Restaurant.OrderDocument			od 
        INNER JOIN dbo.TipoDocumento		    td ON td.idTipoDocumento = od.TipoDocumentoId
        INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento     = od.DocumentoId AND cc.codDoc = IIF(td.codigo = 'FV','01', td.codigo)
        INNER JOIN dbo.PuntoEmision             pe ON pe.idPuntoEmision  = cc.idPuntoEmision
        WHERE YEAR(od.CreatedAt) = YEAR(GETDATE())
        GROUP BY cc.codDoc, YEAR(od.CreatedAt), MONTH(od.CreatedAt)

        INSERT INTO #DashboardStatsResults (TableName ,[Value] ,Quantity)
        SELECT TOP 5 'productsTop'  as TableName
                    ,ar.descripcion as [Description] 
                    ,COUNT(*)       as Quantity
        FROM Restaurant.OrderDetail   od 
        INNER JOIN Restaurant.Item    it ON it.Id = od.ItemId
        INNER JOIN Restaurant.[Order] ro on ro.Id = od.OrderId
        INNER JOIN dbo.Articulo       ar ON ar.idArticulo = it.ProductId
        WHERE YEAR(ro.CreatedAt) = YEAR(GETDATE())
          AND ro.IsActive = 1
          AND od.IsActive = 1
        GROUP BY ar.descripcion

        INSERT INTO #DashboardStatsResults (TableName ,[Value] ,Quantity)
        SELECT 'documentCounts' as TableName
               ,'Order'         as [Value]
               ,COUNT(*)        as Quantity             
        FROM Restaurant.[Order]     ro WITH (NOLOCK)
        INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ro.PuntoEmisionId
        WHERE YEAR(ro.CreatedAt)   = YEAR(GETDATE())
          AND ro.IsActive = 1
          --AND pe.idEstablecimiento = @EstablishmentId

        INSERT INTO #DashboardStatsResults (TableName ,[Value] ,Quantity)
        SELECT 'documentCounts'     as TableName
              ,CASE WHEN cc.codDoc = '01' THEN 'Factura'
	                WHEN cc.codDoc = 'NE' THEN 'Nota Entrega'
	                ELSE 'Otro'
	           END				    as [Value]
	          ,COUNT(*)             as Quantity 
        FROM Restaurant.OrderDocument			od 
        INNER JOIN dbo.TipoDocumento		    td ON td.idTipoDocumento = od.TipoDocumentoId
        INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idDocumento     = od.DocumentoId AND cc.codDoc = IIF(td.codigo = 'FV','01', td.codigo)
        INNER JOIN dbo.PuntoEmision             pe ON pe.idPuntoEmision  = cc.idPuntoEmision
        WHERE YEAR(od.CreatedAt) = YEAR(GETDATE())
        GROUP BY cc.codDoc 

        --> Generar lista de tablas
        SELECT @TableNames = STRING_AGG(TableName, ',') WITHIN GROUP (ORDER BY TableName) FROM (SELECT DISTINCT TableName FROM #DashboardStatsResults) AS t;

        IF @TableNames IS NULL OR @TableNames = ''
            BEGIN
                RAISERROR('Invalid', 16, 1);
                RETURN;
            END

        SELECT *
        FROM #DashboardStatsResults
        ORDER BY TableName,[Year],[Month],Quantity

        IF OBJECT_ID('tempdb..##DashboardStatsResults') IS NOT NULL DROP TABLE #DashboardStatsResults;

    END TRY

    BEGIN CATCH
        IF OBJECT_ID('tempdb..##DashboardStatsResults') IS NOT NULL DROP TABLE #DashboardStatsResults;

		--> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetDashboardStats'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/GetDashboardStats';

        SELECT @ErrorDetails = (
            SELECT JSON_QUERY(@Filters) AS Filters
            FOR JSON PATH
        );

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),@Method,ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),@ErrorProcedure,ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@UserId;

	END CATCH
END
