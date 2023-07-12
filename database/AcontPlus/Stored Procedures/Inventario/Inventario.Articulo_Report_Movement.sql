USE [AcontPlus]
GO

/****** Object:  StoredProcedure [Inventario].[Kardex_Get]    Script Date: 3/2/2023 16:41:15 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Inventario.Articulo_Report_Movement') IS NOT NULL
BEGIN
	DROP PROCEDURE Inventario.Articulo_Report_Movement
END
GO

CREATE PROCEDURE Inventario.Articulo_Report_Movement @idRol INT,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT
	DECLARE @checkBoxFecha BIT
	DECLARE @checkBoxArticulo BIT
	DECLARE @checkBoxTransaccion BIT
	DECLARE @checkBoxUsuario BIT
	DECLARE @codTransaccion VARCHAR(5)
	DECLARE @usuario VARCHAR(150)
	DECLARE @idUsuario INT
	DECLARE @idArticulo INT
	DECLARE @fechaInicio DATETIME
	DECLARE @fechaFin DATETIME
	DECLARE @params NVARCHAR(max) = '@idArticulo INT
	                                ,@idUsuario INT
									,@fechaInicio DATETIME
									,@fechaFin DATETIME
									,@idEntidad INT
									,@codTransaccion VARCHAR(5)'
	DECLARE @sql NVARCHAR(MAX)

	SET @sql = 'SELECT tt.articulo
					  ,tt.codArticulo
					  ,cantidad                = CAST(tt.cantidad as numeric(18,2))
					  ,precioUnitario          = CAST(tt.precioUnitario as numeric(18,2))
					  ,precioTotalSinImpuestos = CASE WHEN tt.codTransaccion = ''S'' THEN CAST(tt.totalSalida as numeric(18,2)) 
					                                  WHEN tt.codTransaccion = ''E'' THEN CAST(tt.totalEntrada as numeric(18,2)) 
													  ELSE 0
												 END 
					  ,tarifa                  = CASE tt.codTransaccion WHEN ''S'' THEN tt.tarifa
													                    WHEN ''E'' THEN ''COSTO''
																		ELSE ''''
												 END 
					  ,tt.clienteProveedor
					  ,fechaRegistro           = FORMAT(tt.fechaRegistro, ''dd/MM/yyyy HH:mm'')
					  ,tt.codDoc
					  ,serieComprobante = tt.nroDocumento
				FROM v_InventarioTransaccion tt
				WHERE tt.idEntidad = @idEntidad AND tt.estado = 1 '

	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @idRol

	SELECT @checkBoxFecha       = checkBoxFecha
		  ,@checkBoxArticulo    = checkBoxArticulo
		  ,@checkBoxTransaccion = checkBoxTransaccion
		  ,@checkBoxUsuario     = checkBoxUsuario
		  ,@idArticulo          = idArticulo
		  ,@idUsuario           = idUsuario
		  ,@codTransaccion      = codTransaccion
		  ,@fechaFin            = fechaFin
		  ,@fechaInicio         = fechaInicio
	FROM OPENJSON(@json) WITH (
				 checkBoxArticulo      BIT '$.checkBoxArticulo'
				,checkBoxFecha         BIT '$.checkBoxFecha'
				,checkBoxTransaccion   BIT '$.checkBoxTransaccion'
				,checkBoxUsuario       BIT '$.checkBoxUsuario'
				,idArticulo            INT '$.idArticulo'
				,idUsuario             INT '$.idUsuario'
				,codTransaccion VARCHAR(5) '$.codTransaccion'
				,fechaInicio      DATETIME '$.fechaInicio'
				,fechaFin         DATETIME '$.fechaFin'
			    )

	SELECT TOP 1 @usuario = 'Usuario : ' + nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

	IF @checkBoxFecha = 1
		BEGIN
			SET @sql = @sql + 'AND CAST(tt.fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
		END

	IF @checkBoxArticulo = 1
		BEGIN
			SET @sql = @sql + 'AND tt.idArticulo = @idArticulo '
		END 

	IF @checkBoxTransaccion = 1
		BEGIN
			SET @sql = @sql + 'AND tt.codTransaccion = @codTransaccion '
		END 

	IF @checkBoxUsuario = 1
		BEGIN
			SET @sql = @sql + 'AND tt.idUsuario = @idUsuario '
		END

	SET @sql = @sql + 'ORDER BY tt.fechaRegistro ASC '

	--Entidad 
	SELECT e.ruc
		  ,e.razonSocial 
		  ,e.nombreComercial	
		  ,ISNULL(e.telefono, '')telefonoEntidad
		  ,ISNULL(e.direccion, '')direccionEntidad			
		  ,tituloReporte = 'CONSUMO POR ARTICULOS'
		  ,usuario       = @usuario
		  ,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha			
	FROM Entidad e WITH (NOLOCK)
	WHERE e.idEntidad = @idEntidad 
			
	EXEC sp_executesql @sql
		              ,@params
		              ,@idArticulo     = @idArticulo
		              ,@idEntidad      = @idEntidad
					  ,@idUsuario      = @idUsuario
					  ,@codTransaccion = @codTransaccion
		              ,@fechaInicio    = @fechaInicio
		              ,@fechaFin       = @fechaFin
END
