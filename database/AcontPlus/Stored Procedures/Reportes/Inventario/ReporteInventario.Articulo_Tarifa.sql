USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspInventarioReporteGeneral]    Script Date: 12/6/2022 9:47:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec ReporteInventario.Articulo_Tarifa 164, '{"byOrderCampo":"ar.descripcion","byOrder":"ASC","byTipoReporte":2,"byTipoFormato":"pdf","codEstab":"ESTAB-000000145","chkProveedor":true,"numeroIdentificacion":"1891723756001","checkboxDetalleBodegaFiltro":false,"filtroFecha":"24-4-2023 18:22"}'
IF OBJECT_ID(N'ReporteInventario.Articulo_Tarifa', N'P') IS NOT NULL
DROP PROCEDURE ReporteInventario.Articulo_Tarifa
GO
CREATE PROCEDURE ReporteInventario.Articulo_Tarifa @idRol INT ,@json NVARCHAR(MAX)
AS
BEGIN 

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @byEntidad INT 
	DECLARE @tituloReporte VARCHAR(150)
	DECLARE @filtroFecha VARCHAR(50)

	DECLARE @checkboxSubFamiliaFiltro BIT ,@bySubFamilia INT
	DECLARE @checkboxStockFiltro      BIT ,@byStock INT
	DECLARE @chkProveedor             BIT ,@rucProveedor VARCHAR(25)
	DECLARE @chkUbicacion             BIT ,@idBodega INT ,@ubicacion VARCHAR(150)
	DECLARE @chkFechaCaducidad        BIT ,@fechaInicio DATETIME ,@fechaFin DATETIME
	DECLARE @checkboxDetalleBodegaFiltro BIT 
	DECLARE @byOrder NVARCHAR(10)			
	DECLARE @byOrderCampo NVARCHAR(50)	
	
	DECLARE @params NVARCHAR(MAX)='@byEntidad    INT									
								  ,@bySubFamilia INT
								  ,@byOrder      VARCHAR(10)									
								  ,@byOrderCampo VARCHAR(50)
								  ,@rucProveedor VARCHAR(25)'			
		
	DECLARE @sql NVARCHAR(MAX) = 'SELECT ar.idArticulo
									    ,ar.descripcion
									    ,ar.codigo
									    ,ar.subfamilia
									    ,ar.tarifa
									    ,CAST(ar.precioConIva as numeric(15,2)) as precioConIva
								  FROM v_Articulo_Tarifa ar WITH (NOLOCK)
								  WHERE ar.estado = 1 AND ar.idEntidad = @byEntidad '
	
	SELECT TOP 1 @byEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol
			
	SELECT
		 @filtroFecha              = filtroFecha
		,@checkboxSubFamiliaFiltro = checkboxSubFamiliaFiltro ,@bySubFamilia = bySubFamilia
		,@checkboxStockFiltro      = checkboxStockFiltro      ,@byStock      = byStock
		,@chkProveedor             = chkProveedor             ,@rucProveedor = numeroIdentificacion
		,@chkFechaCaducidad         = ckFechaCaducidad         ,@fechaInicio  = fechaInicio ,@fechaFin = fechaFin
		,@byOrder                  = byOrder			 
		,@byOrderCampo             = byOrderCampo		
	FROM OPENJSON(@json)
	WITH ( filtroFecha            VARCHAR(50) '$.filtroFecha'			
			,checkboxSubFamiliaFiltro     BIT '$.checkboxSubFamiliaFiltro',bySubFamilia                 INT '$.bySubFamilia'	
			,checkboxStockFiltro          BIT '$.checkboxStockFiltro'     ,byStock                      INT '$.byStock'	
			,chkProveedor                 BIT '$.chkProveedor'            ,numeroIdentificacion VARCHAR(25) '$.numeroIdentificacion'
			,chkUbicacion                 BIT '$.chkUbicacion'            ,idBodega                     INT '$.idBodega'            ,ubicacion VARCHAR(100) '$.ubicacion'
			,ckFechaCaducidad             BIT '$.ckFechaCaducidad'        ,fechaInicio             DATETIME '$.fechaInicio'         ,fechaFin      DATETIME '$.fechaFin'
			,byOrder              VARCHAR(10) '$.byOrder'
			,byOrderCampo         VARCHAR(50) '$.byOrderCampo'	
	) AS dt	
			
	IF @chkProveedor = 1
		BEGIN
			SET @sql = @sql + 'AND ar.idArticulo IN (SELECT it.idArticulo FROM v_InventarioTransaccion it WHERE it.rucClienteProveedor = @rucProveedor) '
		END

	IF @chkUbicacion = 1
		BEGIN
			SET @sql = @sql + 'AND ar.idArticulo IN (SELECT sa.idArticulo FROM v_Articulo_Stock sa WITH (NOLOCK) WHERE sa.idBodega = @idBodega AND sa.ubicacion LIKE ''%'' + @ubicacion + ''%'' ) '
		END 

	IF @chkFechaCaducidad = 1
		BEGIN
			SET @sql = @sql + 'AND ar.caducidad = 1 AND CAST(ar.fechaCaducidad AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
		END 

	IF @checkboxSubFamiliaFiltro = 1
		BEGIN
			SET @sql = @sql + 'AND ar.idSubFamilia = @bySubFamilia '
		END

	IF @checkboxStockFiltro = 1 AND @byStock = 1 
		BEGIN			
			SET @sql = @sql + 'AND ar.stock > 0 '
		END 

	--Articulo sin Stock 
	IF  @checkboxStockFiltro = 1 AND @byStock = 2 
		BEGIN			
			SET @sql = @sql + 'AND ar.stock <= 0 '
		END

	IF @byOrderCampo = 'ar.idSubFamilia'
		BEGIN
			SET @byOrderCampo = 'ar.idSubFamilia'
		END

	SET @sql = @sql + ' ORDER BY '+ @byOrderCampo+ ' ' +  @byOrder
		
	SELECT		    
		e.ruc
		,e.razonSocial 
		,e.nombreComercial	
		,ISNULL(e.telefono, '')telefonoEntidad
		,ISNULL(e.direccion, '')direccionEntidad
		,@filtroFecha as filtroFecha			
		FROM dbo.Entidad e	WITH(NOLOCK)	
		WHERE e.idEntidad = @byEntidad


	EXEC sp_executesql @sql, 
				@params,	
				@byEntidad    = @byEntidad,
				@bySubFamilia = @bySubFamilia,
				@byOrder      = @byOrder,
				@byOrderCampo = @byOrderCampo,
				@rucProveedor =  @rucProveedor

	
		
END 