USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPReporteVentaEstadistica]    Script Date: 24/2/2023 10:28:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('ASPReporteVentaEstadistica')IS NOT NULL
	DROP PROCEDURE ASPReporteVentaEstadistica
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-15
-- Description: SP FOR GET ESTADISTICAS
-- =============================================
-- exec ASPReporteVentaEstadistica '{"tipoReporte":"","radioFechaFiltro":true,"checkboxClienteFiltro":false,"checkboxEstadoFiltro":false,"checkboxUsuarioFiltro":false,"byOrderCampo":"fv.fechaEmision","byOrder":"ASC","byTipoFormato":"pdf","codDoc":"FV","byAnio":"2023","checkboxTipoDocRG":false,"byTipoDocRG":0,"fechaInicio":"2023-02-01T05:00:00.000Z","fechaFin":"2023-02-28T05:00:00.000Z","idRol":38,"anio":2023}'
CREATE   PROCEDURE [dbo].[ASPReporteVentaEstadistica] @json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

	DECLARE @idRol INT
			,@year SMALLINT
			,@checkboxSucursalRG   BIT
			,@codEstab             VARCHAR(150)
			,@checkboxPtoEmisionRG BIT
			,@byPtoEmisionRG       INT
			,@checkboxTipoDocRG    BIT
			,@byTipoDocRG          VARCHAR(10)
			,@subConsulta NVARCHAR(MAX) = ''

			,@params NVARCHAR(MAX) = '@byEntidad INT,
									  @codEstab VARCHAR(150),
									  @byPtoEmisionRG INT,
									  @byTipoDocRG VARCHAR(10),
									  @year SMALLINT'
			,@groupBy NVARCHAR(MAX) = ' GROUP BY gm.codMes, gm.mes, td.descripcion, td.idTipoDocumento, td.fechaRegistro ORDER BY gm.codMes ASC '

			,@sql NVARCHAR(MAX) = 'SELECT 
										gm.codMes, 
										nombreMes = gm.mes, 
										doc       = td.descripcion,
										total     = ISNULL((SELECT SUM(docs.total) FROM #tempDocEstadistica docs WHERE docs.idTipoDocumento = td.idTipoDocumento AND docs.idEntidad = @byEntidad AND docs.codMes = gm.codMes AND YEAR(docs.fechaRegistro) = @year), 0)								
									FROM dbo.afnGetMonth()  gm
									CROSS JOIN TipoDocumento td '

			
			--Obteniendo los valores 
		
			
			SELECT @idRol                 = idRol
				   ,@year                 = anio 
				   ,@checkboxSucursalRG   = checkboxSucursalRG
				   ,@codEstab             = codEstab
				   ,@checkboxPtoEmisionRG = checkboxPtoEmisionRG
				   ,@byPtoEmisionRG       = byPtoEmisionRG
				   ,@checkboxTipoDocRG    = checkboxTipoDocRG
				   ,@byTipoDocRG          = byTipoDocRG
			FROM OPENJSON(@json) 
			WITH (
					idRol				  INT '$.idRol'
					,anio				  SMALLINT '$.anio'
					,checkboxSucursalRG   BIT '$.checkboxSucursalRG'
					,codEstab             VARCHAR(150) '$.codEstab'
					,checkboxPtoEmisionRG BIT '$.checkboxPtoEmisionRG'
					,byPtoEmisionRG       INT '$.byPtoEmisionRG'
					,checkboxTipoDocRG    BIT '$.checkboxTipoDocRG'
					,byTipoDocRG          NVARCHAR(100) '$.byTipoDocRG'
				  )

			
			DECLARE @byEntidad INT = (SELECT idEntidad FROM AFTDataRol(@idRol))
			
			IF(OBJECT_ID('tempdb..#tempDocEstadistica') IS NOT NULL) BEGIN DROP TABLE #tempDocEstadistica END
			
			SELECT idEntidad, 
				   codEstab, 
				   idPuntoEmision, 
				   idTipoDocumento, 
				   idDocumento,
				   idCliente,
				   codigo,
				   total,
				   tipoDoc,
				   codMes,
				   fechaEmision,
				   fechaRegistro  
			INTO #tempDocEstadistica FROM (
				SELECT 
					idEntidad       = fv.idEntidad,
					codEstab        = es.codEstab,
					idPuntoEmision  = pe.idPuntoEmision,
					idTipoDocumento = td.idTipoDocumento,
					idDocumento     = fv.idFactura,
					idCliente       = fv.idCliente,
					codigo          = td.codigo,
					total           = fv.total,
					tipoDoc         = td.descripcion,
					codMes          = DATEPART(MM, fv.fechaEmision),									
					fechaEmision    = fv.fechaEmision,
					fechaRegistro   = fv.fechaRegistro				
				FROM Factura fv 
				INNER JOIN PuntoEmision        pe ON pe.idPuntoEmision = fv.idPuntoEmision
				INNER JOIN Sri.Establecimiento es ON es.codEstab = pe.codEstab
				INNER JOIN TipoDocumento       td ON td.idTipoDocumento = fv.idTipoDocumento
				INNER JOIN Cliente             cl ON cl.idCliente = fv.idCliente
				WHERE fv.idEntidad = @byEntidad

				UNION ALL

				SELECT 
					idEntidad       = ne.idEntidad,
					codEstab        = es.codEstab,
					idPuntoEmision  = pe.idPuntoEmision,
					idTipoDocumento = td.idTipoDocumento,
					idDocumento     = ne.idNotaEntrega,
					idCliente       = ne.idCliente,
					codigo          = td.codigo,
					total           = ne.total,
					tipoDoc         = td.descripcion,
					codMes          = DATEPART(MM, ne.fechaEmision),									
					fechaEmision    = ne.fechaEmision,
					fechaRegistro   = ne.fechaRegistro	
				FROM dbo.NotaEntrega ne
				INNER JOIN PuntoEmision        pe ON pe.idPuntoEmision  = ne.idPuntoEmision
				INNER JOIN Sri.Establecimiento es ON es.codEstab        = pe.codEstab
				INNER JOIN TipoDocumento       td ON td.idTipoDocumento = ne.idTipoDocumento
				INNER JOIN Cliente             cl ON cl.idCliente       = ne.idCliente
				WHERE ne.idEntidad = @byEntidad

				UNION ALL

				SELECT 
					idEntidad       = nc.idEntidad,
					codEstab        = es.codEstab,
					idPuntoEmision  = pe.idPuntoEmision,
					idTipoDocumento = td.idTipoDocumento,
					idDocumento     = nc.idNotaCredito,
					idCliente       = nc.idCliente,
					codigo          = td.codigo,
					total           = nc.total,
					tipoDoc         = td.descripcion,
					codMes          = DATEPART(MM, nc.fechaEmision),									
					fechaEmision    = nc.fechaEmision,
					fechaRegistro   = nc.fechaRegistro	
				FROM NotaCredito nc 
				INNER JOIN PuntoEmision        pe ON pe.idPuntoEmision  = nc.idPuntoEmision
				INNER JOIN Sri.Establecimiento es ON es.codEstab        = pe.codEstab
				INNER JOIN TipoDocumento       td ON td.idTipoDocumento = nc.idTipoDocumento
				INNER JOIN Cliente             cl ON cl.idCliente       = nc.idCliente
				WHERE nc.idEntidad = @byEntidad

				UNION ALL 

				SELECT 
					idEntidad       = rv.idEntidad,
					codEstab        = es.codEstab,
					idPuntoEmision  = 0,
					idTipoDocumento = td.idTipoDocumento,
					idDocumento     = rv.idRetencionVenta,
					idCliente       = rv.idCliente,
					codigo          = td.codigo,
					total           = rv.total,
					tipoDoc         = td.descripcion,
					codMes          = DATEPART(MM, rv.fechaEmision),									
					fechaEmision    = rv.fechaEmision,
					fechaRegistro   = rv.fechaRegistro					
				FROM RetencionVenta rv 
				INNER JOIN Sri.Establecimiento es ON es.codEstab = rv.codEstab
				INNER JOIN TipoDocumento td ON td.idTipoDocumento = rv.idTipoDocumento
				WHERE rv.idEntidad = @byEntidad

			) as temp


			
		IF @checkboxSucursalRG = 1
			BEGIN
				SET @sql = 'SELECT 
								gm.codMes, 
								nombreMes = gm.mes, 
								doc = td.descripcion,
								total = ISNULL((SELECT SUM(docs.total) FROM  #tempDocEstadistica docs WHERE docs.idTipoDocumento = td.idTipoDocumento AND docs.idEntidad = @byEntidad AND docs.codMes = gm.codMes AND YEAR(docs.fechaRegistro) = @year AND docs.codEstab = @codEstab), 0)								
								FROM dbo.afnGetMonth() gm
								CROSS JOIN TipoDocumento td '
			END

		IF @checkboxSucursalRG = 1 AND  @checkboxPtoEmisionRG = 1
			BEGIN 
				 SET @sql = 'SELECT 
								gm.codMes, 
								nombreMes = gm.mes, 
								doc = td.descripcion,
								total = ISNULL((SELECT SUM(docs.total) FROM  #tempDocEstadistica docs WHERE docs.idTipoDocumento = td.idTipoDocumento AND docs.idEntidad = @byEntidad AND docs.codMes = gm.codMes AND YEAR(docs.fechaRegistro) = @year AND docs.codEstab = @codEstab AND idPuntoEmision = @byPtoEmisionRG), 0)								
								FROM dbo.afnGetMonth() gm
								CROSS JOIN TipoDocumento td '
			END 
	
		
		IF @checkboxTipoDocRG = 0 
		
			BEGIN 
			PRINT 'DEFAULT tipo doc '
				SET @sql = @sql + '  WHERE td.codigo  IN (''FV'', ''NE'', ''NC'', ''RV'')  ' + @groupBy
			END 

		IF @checkboxTipoDocRG = 1 AND @byTipoDocRG = '1'
		
			BEGIN
			PRINT 'DEFAULT tipo check y id '
				SET @sql = @sql + '  WHERE td.codigo IN (''FV'', ''NE'') ' + @groupBy
			END

		IF @checkboxTipoDocRG = 1  AND @byTipoDocRG != '1'
	
			BEGIN 
			PRINT 'DEFAULT 1'
				SET @sql = @sql + '  WHERE td.codigo  = @byTipoDocRG  ' + @groupBy
			END



		EXEC sp_executesql @sql, 
						   @params,
						   @byEntidad       = @byEntidad,
						   @codEstab        = @codEstab,
						   @byPtoEmisionRG  = @byPtoEmisionRG,
						   @byTipoDocRG     = @byTipoDocRG,
						   @year            =  @year
		
END