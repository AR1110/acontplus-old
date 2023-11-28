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
IF OBJECT_ID(N'Inventario.Consolidacion_Get', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Consolidacion_Get
GO
CREATE PROCEDURE Inventario.Consolidacion_Get @idUsuarioRol INT 
,@json VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT
	,@tipo INT
	,@id INT
	,@opcion INT
	,@idArticulo INT 
	,@rucProveedor VARCHAR(25)
	,@idSubFamilia INT
	,@nroDocumento VARCHAR(25)
	,@sql NVARCHAR(MAX) 
	,@params NVARCHAR(MAX)
    ,@pageIndex INT   
    ,@pageSize INT    
    ,@ckFecha BIT 
    ,@fechaInicio DATETIME2 
    ,@fechaFin DATETIME2


	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
	
	SELECT @tipo = tipo FROM OPENJSON (@json) WITH (tipo INT)

	--> DataForm
    IF @tipo = 1
		BEGIN
			SELECT * FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
			SELECT * FROM SubFamilia     WITH(NOLOCK) WHERE idEntidad = @idEntidad
			SELECT * FROM Config.Sistema WITH(NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD' 

            RETURN 
		END

    --> Get
	IF @tipo = 2
		BEGIN

            SELECT @pageIndex   = pageIndex  
                  ,@pageSize    = pageSize
                  ,@ckFecha     = ckFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin    = fechaInicio
            FROM OPENJSON(@json) WITH 
            (
                pageIndex   INT
               ,pageSize    INT
               ,ckFecha     BIT 
               ,fechaInicio DATETIME2
               ,fechaFin    DATETIME2
            )
			
            SET @sql = 'SELECT ci.idConsolidacionInventario
				              ,FORMAT(ci.fechaEmision, ''dd/MM/yyyy HH:mm'')           as fechaEmision
				              ,observacion 
				              ,ci.total
				              ,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ci.nroDoc) as nroDoc
				              ,ep.descripcion                                          as estadoDoc
				              ,ep.codigo                                               as codDoc
				              ,u.nombreUsuario                                         as usuario
				              ,IIF(ep.codigo = ''A'',''table-danger'','''')            as style
                              ,COUNT(*) OVER()                                         as totalRecords
			            FROM dbo.ConsolidacionInventario ci WITH (NOLOCK)
			            INNER JOIN dbo.PuntoEmision      pe WITH (NOLOCK) ON pe.idPuntoEmision = ci.idPuntoEmision
			            INNER JOIN Sri.Establecimiento    s WITH (NOLOCK) ON s.codEstab        = pe.codEstab
			            INNER JOIN dbo.Usuario            u WITH (NOLOCK) ON u.idUsuario       = ci.idUsuario
			            INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago   = ci.idEstadoDocumento
			            WHERE ci.idEntidad = @idEntidad '

            SET @params = '@idEntidad   INT
                          ,@fechaInicio DATETIME
                          ,@fechaFin    DATETIME
                          ,@pageIndex   INT
                          ,@pageSize    INT'

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(ci.fechaEmision as DATE) BETWEEN CAST(@fechaInicio as DATE) AND CAST(@fechaFin as DATE) '
                END 

            SET @sql = @sql + 'ORDER BY ci.idConsolidacionInventario DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql,@params 
								   ,@idEntidad       = @idEntidad
								   ,@fechaInicio     = @fechaInicio
								   ,@fechaFin        = @fechaFin
								   ,@pageIndex       = @pageIndex
								   ,@pageSize        = @pageSize

            RETURN
		END
    
    --> Get Id For Edit
	IF @tipo = 3
		BEGIN
            
            SELECT @id = id FROM OPENJSON (@json) WITH (id INT)

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
			INNER JOIN Inventario.v_Articulo a WITH(NOLOCK) ON a.idArticulo = cid.idArticulo
			INNER JOIN Medida m WITH(NOLOCK) ON m.idMedida = cid.idMedida
			INNER JOIN TipoIva ti WITH(NOLOCK) ON ti.idTipoIva = a.idTipoIva
			WHERE cid.idConsolidacionInventario = @id AND cid.estado = 1

			SELECT 
				 cid.idConsolidacionInventarioDetalle
				,a.idMedida 
				,a.medida
				,precioCosto = cid.precioCosto
				,medidasTemp = (CASE WHEN a.fraccionado = 1 THEN (SELECT cid.idConsolidacionInventarioDetalle, af.idMedida, m.descripcion, af.precioCostoFraccionado precioCosto FROM ArticuloFraccionado af WITH (NOLOCK) 
																												   INNER JOIN Medida m WITH (NOLOCK) ON af.idMedida = m.idMedida 
																												   WHERE af.idArticulo = a.idArticulo FOR JSON PATH) ELSE '[]' END)
			FROM ConsolidacionInventarioDetalle cid WITH(NOLOCK) 
			INNER JOIN v_Articulo a WITH(NOLOCK) ON a.idArticulo = cid.idArticulo 
			WHERE cid.idConsolidacionInventario = @id AND cid.estado = 1

            RETURN 

		END

    --> Filter 
	IF @tipo = 4
		BEGIN
            
            SELECT @opcion       = opcion 
	              ,@idArticulo   = idArticulo
	              ,@rucProveedor = rucProveedor
	              ,@idSubFamilia = idSubFamilia
	              ,@nroDocumento = nroDocumento
	        FROM OPENJSON (@json) WITH 
            (
	            opcion       INT  
	           ,idArticulo   INT 
	           ,rucProveedor VARCHAR(25) 
	           ,idSubFamilia INT 
	           ,nroDocumento VARCHAR(25)
	        )

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
				         FROM Inventario.v_Articulo a 
				         WHERE a.estado = 1 
				           AND a.idEntidad = @idEntidad
				           AND a.llevaInventario = 1 '

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
		
		    EXEC sp_executesql @sql,@params
							   ,@idEntidad    = @idEntidad 
							   ,@idArticulo   = @idArticulo
							   ,@idSubFamilia = @idSubFamilia
							   ,@rucProveedor = @rucProveedor
							   ,@nroDocumento = @nroDocumento
            RETURN 
		END
 
END
