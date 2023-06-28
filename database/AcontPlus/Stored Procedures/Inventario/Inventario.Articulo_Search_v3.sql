 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE Inventario.Articulo_Search_v3 @json VARCHAR(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @byFraccionado BIT
	DECLARE @ruc VARCHAR(13)
	,@idEntidad INT
	,@idUsuarioRol INT
	,@user VARCHAR(100)
	DECLARE @byArticulo INT
	DECLARE @bySearch VARCHAR(500)
	DECLARE @idBodega INT
	DECLARE @codEstab_Asig VARCHAR(150)
	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT
									,@idArticulo INT
								    ,@busqueda VARCHAR(500)
									,@idBodega INT'

	

	SELECT @bySearch = REPLACE(busqueda, space(1), '%')
		,@byFraccionado = fraccionado
		,@ruc  = ruc
		,@user = username
	FROM OPENJSON(@json) WITH (
			busqueda VARCHAR(500) '$.busqueda'
			,fraccionado BIT '$.fraccionado'
			,ruc VARCHAR(13) '$.uniqueId'
			,username VARCHAR(100)  '$.username'
			)

	DECLARE @tblResult AS TABLE (
		idArticulo INT
		,codigo VARCHAR(25)
		,descripcion VARCHAR(300)
		,iva VARCHAR(10)
		,stock DECIMAL(15, 2)
		,stockMinimo DECIMAL(15, 2)
		,subFamilia VARCHAR(100)
		,marca VARCHAR(100)
		,medida VARCHAR(100)
		,porcentaje DECIMAL(4, 0)
		,precioSinSubsidio NUMERIC(18, 6)
		)
	DECLARE @paramsII NVARCHAR(MAX) = '@idEntidad INT 
								    ,@busqueda VARCHAR(500) '
	DECLARE @sqlQuery NVARCHAR(MAX) = '
	SELECT TOP 15  a.idArticulo
								,codigo	 
								,descripcion 
								,iva 
								,stock  
								,stockMinimo
								,subFamilia  
								,marca   
								,medida
								,porcentaje
								,precioSinSubsidio
							
	FROM v_Articulo a
	WHERE a.idEntidad = @idEntidad 
	AND a.estado = 1
	AND ( 
		a.descripcion LIKE ''%''+@busqueda+''%'' OR
		a.codigo LIKE ''%''+@busqueda+''%'' OR
		a.codigoAuxiliar LIKE ''%''+@busqueda+''%'' OR
		a.codigoBarra LIKE ''%''+@busqueda+''%'' 
	) '

	IF @byFraccionado = 1
	BEGIN
		SET @sqlQuery = @sqlQuery + 'AND a.productoFraccionable = 1 '
	END

	SELECT @idEntidad = idEntidad, @idUsuarioRol = idUsuarioRol
	FROM v_usuario WITH (NOLOCK)
	WHERE rucEmpresa = @ruc AND nombreUsuario = @user

	SELECT @codEstab_Asig = codEstab_Asig
	FROM Config.Estab_Asig WITH (NOLOCK)
	WHERE idUsuarioRol = @idUsuarioRol
		AND predeterminado = 1

	SELECT @idBodega = idBodega
	FROM Config.Bodeg_Asig WITH (NOLOCK)
	WHERE codEstab_Asig = @codEstab_Asig
		AND predeterminado = 1

	----SET @sql = @sql + 'ORDER BY a.descripcion ASC'
	INSERT INTO @tblResult (
		idArticulo
		,codigo
		,descripcion
		,iva
		,stock
		,stockMinimo
		,subfamilia
		,marca
		,medida
		,porcentaje
		,precioSinSubsidio
		)
	EXEC SP_EXECUTESQL @sqlQuery
		,@paramsII
		,@idEntidad = @idEntidad
		,@busqueda = @bySearch

	IF EXISTS (
			SELECT 1
			FROM @tblResult
			)
	BEGIN
		SELECT a.idArticulo
			,codigo = IIF(a.porcentaje > 0, '*', '') + a.codigo
			,a.descripcion
			,CAST(CAST(a.iva as decimal(15,0)) AS varchar)+'%' iva
			,a.stock
			,a.stockMinimo
			,ISNULL(a.subfamilia, 'N/A') subFamilia
			,ISNULL(a.marca, 'N/A') marca
			,ISNULL(a.medida, 'N/A') medida
			,style = CASE 
				WHEN a.stock <= 0
					THEN 'badge badge-danger'
				WHEN a.stock > 0
					AND a.stock < a.stockMinimo
					THEN 'badge badge-warning'
				ELSE ''
				END
			,priceSale = (
				SELECT tarifa = t.descripcion
					,precio = p.precioConIva
				FROM dbo.ArticuloPvP p WITH (NOLOCK)
				INNER JOIN dbo.Tarifa t WITH (NOLOCK) ON t.idTarifa = p.idTarifa
				WHERE p.idArticulo = a.idArticulo
				ORDER BY t.codigo ASC
				FOR JSON PATH
				)
			,warehouses = (
				SELECT ubicacion = ISNULL(au.ubicacion, 'N/A')
				FROM dbo.ArticuloUbicacion au WITH (NOLOCK)
				WHERE au.idArticulo = a.idArticulo
					AND au.idBodega = @idBodega
				FOR JSON PATH
				)
			,ISNULL(precioSinSubsidio, 0) precioSinSubsidio
			

		FROM @tblResult a
	END

    
END
GO
