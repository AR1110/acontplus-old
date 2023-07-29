USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[ConsolidacionInventario_Get]    Script Date: 1/31/2023 2:18:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.StockFisico_Get', N'P') IS NOT NULL
DROP PROCEDURE Inventario.StockFisico_Get
GO
CREATE PROCEDURE Inventario.StockFisico_Get @userRoleId INT 
,@json VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE  @idEntidad INT
	,@tipo INT
	,@id INT
	,@opcion INT
	,@idArticulo INT 
	,@rucProveedor VARCHAR(25)
	,@idSubFamilia INT
	,@nroDocumento VARCHAR(25)
	,@sql NVARCHAR(MAX) 
	,@params NVARCHAR(MAX)

	SET @idEntidad = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)
	
	SET @params = '@idEntidad INT,
				   @idArticulo INT,
				   @rucProveedor VARCHAR(25),
				   @idSubFamilia INT,
				   @nroDocumento VARCHAR(25) '

	SET @sql = 'SELECT a.idArticulo
				,codigo
				,codigoAuxiliar
				,codigoBarra
				,descripcion
				,stock
				,precioCosto
				,estado
				,iva
				,cantidad = 1
				,llevaInventario
				,ISNULL(idMedida,0) idMedida
				,ISNULL(a.medida, ''SIN MEDIDA'') medida
				,ISNULL(tipoIva, ''SIN IVA'') AS nombreTipoIva
				,a.fraccionado
				,CASE WHEN a.fraccionado = 1 THEN (SELECT af.idMedida, m.descripcion, af.precioCostoFraccionado precioCosto FROM ArticuloFraccionado af WITH (NOLOCK) 
																												   INNER JOIN Medida m WITH (NOLOCK) ON af.idMedida = m.idMedida WHERE af.idArticulo = a.idArticulo FOR JSON PATH)
				ELSE ''[]'' END medidas
				FROM v_Articulo a 
				WHERE a.estado = 1 
				AND a.idEntidad = @idEntidad
				AND a.llevaInventario = 1 '


	SELECT @tipo = tipo
	,@id = id
	,@opcion = opcion 
	,@idArticulo = idArticulo
	,@rucProveedor = rucProveedor
	,@idSubFamilia = idSubFamilia
	,@nroDocumento = nroDocumento
	FROM OPENJSON (@json) WITH (
								tipo INT '$.tipo', 
								id INT '$.id',
								opcion INT '$.opcion', 
								idArticulo INT '$.idArticulo',
								rucProveedor VARCHAR(25) '$.rucProveedor',
								idSubFamilia INT '$.idSubFamilia',
								nroDocumento VARCHAR(25) '$.nroDocumento'
								)
	IF @tipo = 1
		BEGIN
			SELECT * FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
			SELECT * FROM SubFamilia WITH(NOLOCK) WHERE idEntidad = @idEntidad
			SELECT * FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD' --AND JSON_VALUE(jsonConfig, '$[0].codTransaccion') = 'AL'
			SELECT cd.*
			FROM v_ConfigDocumento cd 
				INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab
			WHERE pa.idUsuarioRol = @userRoleId
			AND cd.codDocumento = 'TF'
		END

	IF (@tipo = 2)
		BEGIN
			SELECT *
			FROM v_StockFisico WITH (NOLOCK)
			WHERE idEntidad = @idEntidad
		END

	IF (@tipo = 3)
		BEGIN
			SELECT 
				 idConsolidacionInventario = ci.idConsolidacionInventario
				,fechaEmision = CAST(ci.fechaEmision AS date)
				,observacion  = ISNULL(ci.observacion,'Ninguna') 
				,total        = ci.total
				,idPuntoEmision = ci.idPuntoEmision
				,codEstab       = es.codEstab
			FROM dbo.ConsolidacionInventario ci
			INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = ci.idPuntoEmision
			INNER JOIN Sri.Establecimiento es ON es.codEstab = pe.codEstab
			WHERE ci.idConsolidacionInventario = @id

			SELECT 
				 idConsolidacionInventarioDetalle = cid.idConsolidacionInventarioDetalle
				,idBodega = cid.idBodega
				,idArticulo = cid.idArticulo
				,idMedida = cid.idMedida
				,descripcion = cid.descripcion
				,cantidad = cid.cantidad
				,precioCosto = cid.precioCosto
				,precioActual = cid.precioActual
				,codigo = a.codigo
				,codigoTipoIva = ti.codigo
				,nombreTipoIva = ti.descripcion
				,stock = a.stock
				,a.fraccionado
				,m.descripcion medida
				,total = (cantidad * cid.precioActual)				
			FROM ConsolidacionInventarioDetalle cid WITH(NOLOCK) 
			INNER JOIN v_Articulo a WITH(NOLOCK) ON a.idArticulo = cid.idArticulo
			INNER JOIN Medida m WITH(NOLOCK) ON m.idMedida = cid.idMedida
			INNER JOIN TipoIva ti WITH(NOLOCK) ON ti.idTipoIva = a.idTipoIva
			WHERE cid.idConsolidacionInventario = @id AND cid.estado = 1



		END

	IF (@tipo = 4)
		BEGIN
			IF (@opcion = 1)
				BEGIN 
					SET @sql = @sql + 'AND a.idArticulo = @idArticulo '
				END
			IF (@opcion = 3)
				BEGIN
					SET @sql = @sql + 'AND a.idSubFamilia = @idSubFamilia '
				END
			IF (@opcion = 4)
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
				END
			IF (@opcion = 5)
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE nroDocumento = @nroDocumento) '
				END
		SET @sql = @sql + 'ORDER BY a.fechaModificacion DESC '
		EXEC sp_executesql @sql, @params
							   ,@idEntidad = @idEntidad 
							   ,@idArticulo = @idArticulo
							   ,@idSubFamilia = @idSubFamilia
							   ,@rucProveedor = @rucProveedor
							   ,@nroDocumento = @nroDocumento
		END
 
END
