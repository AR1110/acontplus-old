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
CREATE OR ALTER PROCEDURE Inventario.Consolidacion_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Filters
	DECLARE @id             INT
	       ,@opcion         INT
	       ,@idArticulo     INT 
	       ,@rucProveedor   VARCHAR(25)
	       ,@idSubFamilia   INT
	       ,@nroDocumento   VARCHAR(25)
           ,@ckFecha        BIT 
           ,@fechaInicio    DATETIME2 
           ,@fechaFin       DATETIME2
           ,@idPuntoEmision INT


	--> Variables
	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId;
    
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT)

    --> Get
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'consolidaciones'

            SELECT @pageIndex   = pageIndex  
                  ,@pageSize    = pageSize
                  ,@ckFecha     = ckFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin    = fechaFin
            FROM OPENJSON(@json) WITH 
            (
                pageIndex   INT
               ,pageSize    INT
               ,ckFecha     BIT 
               ,fechaInicio DATETIME2
               ,fechaFin    DATETIME2
            )
			
            SET @sql = 'SELECT ci.idConsolidacionInventario
				              ,FORMAT(ci.fechaEmision, ''dd/MM/yyyy HH:mm'')            as fechaEmision
				              ,observacion 
				              ,ci.total
				              ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,ci.nroDoc) as nroDoc
				              ,ep.descripcion                                           as estadoDoc
				              ,ep.codigo                                                as codDoc
				              ,us.nombreUsuario                                         as usuario
				              ,IIF(ep.codigo = ''A'',''table-danger'','''')             as style
                              ,COUNT(*) OVER()                                          as totalRecords
			            FROM dbo.ConsolidacionInventario ci WITH (NOLOCK)
			            INNER JOIN dbo.PuntoEmision      pe WITH (NOLOCK) ON pe.idPuntoEmision    = ci.idPuntoEmision
			            INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario         = ci.idUsuario
			            INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago      = ci.idEstadoDocumento
                        INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
			            WHERE ci.idEntidad = @idEntidad '

            SET @params = '@idEntidad   INT
                          ,@fechaInicio DATETIME2
                          ,@fechaFin    DATETIME2
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

	--> DataForm
    IF @tipo = 2
		BEGIN
            
            SET @tableNames = 'ptoEmision,bodegas,subFamilia,decimales,tiposTransaccion'

			SELECT * FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			
            SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
			
            SELECT * FROM SubFamilia     WITH(NOLOCK) WHERE idEntidad = @idEntidad
			
            SELECT * FROM Config.v_Sistema_Decimal WITH(NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'AL' 
            SELECT * FROM Inventario.TipoTransaccion WHERE codigo IN ('E','S')
            SELECT * FROM Inventario.TipoDocumento WHERE codigo IN ('CI')
            RETURN 
		END

    --> Ver Detalle
	IF @tipo = 3
		BEGIN
            
            SET @tableNames = 'comprobante,detalles'

            SELECT @id = id FROM OPENJSON (@json) WITH (id INT)

			SELECT ci.idConsolidacionInventario
				  ,ci.fechaEmision 
				  ,ci.observacion
				  ,ci.total
				  ,es.nombreComercial
                  ,es.estab + '-' + pe.ptoEmi as ptoEmi 
			FROM dbo.ConsolidacionInventario ci WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision      pe WITH (NOLOCK) ON pe.idPuntoEmision = ci.idPuntoEmision
			INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
			WHERE ci.idConsolidacionInventario = @id

			SELECT cd.idConsolidacionInventarioDetalle
				  ,ar.codigo
                  ,cd.descripcion
                  ,ar.stock
                  ,cd.cantidad
                  ,me.descripcion as medida
                  ,bo.descripcion as bodega
                  ,cd.precioActual
                  ,cd.precioCosto
                  ,CAST(cd.precioCosto * cd.cantidad as numeric(18,5)) as total
			FROM dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK) 
			INNER JOIN dbo.Articulo                 ar WITH (NOLOCK) ON ar.idArticulo = cd.idArticulo
			INNER JOIN dbo.Medida                   me WITH (NOLOCK) ON me.idMedida   = cd.idMedida
            INNER JOIN dbo.Bodega                   bo WITH (NOLOCK) ON bo.idBodega   = cd.idBodega
			WHERE cd.idConsolidacionInventario = @id 
              AND cd.estado = 1
            ORDER BY cd.idConsolidacionInventarioDetalle ASC
			
            RETURN 

		END

    --> Filter 
	IF @tipo = 4
		BEGIN
            
            SET @tableNames = 'articulos'

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

	        SET @sql = 'SELECT TOP 100
                               a.idArticulo
				              ,codigo
				              ,codigoAuxiliar
				              ,codigoBarra
				              ,descripcion
				              ,stock
				              ,precioCosto
				              ,estado
				              ,iva
				              ,cantidad = a.stock
				              ,llevaInventario
				              ,ISNULL(idMedida,0) idMedida
				              ,ISNULL(a.medida, ''SIN MEDIDA'') medida
				              ,ISNULL(tipoIva, ''SIN IVA'') AS nombreTipoIva
				              ,ISNULL
                               ((
                                    SELECT me.idMedida
                                          ,me.descripcion as medida
                                          ,ar.precioCosto
                                          ,af.precioCostoFraccionado as precioUnitario
                                          ,af.precioCostoFraccionado as precioCostoFraccionado
                                          ,af.conversion
                                    FROM ArticuloFraccionado af WITH (NOLOCK) 
                                    INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
                                    INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida 
                                    WHERE af.idArticulo = a.idArticulo 
                                    FOR JSON PATH

                                ),''[]'') as fraccionado 

                               ,ISNULL
                                ((
                                    SELECT me.idMedida 
                                          ,me.descripcion as medida
                                          ,ar.precioCosto 
                                          ,ar.precioCosto  as precioUnitario
                                          ,ar.precioCosto  as precioCostoFraccionado
                                          ,1 as conversion
                                    FROM Articulo     ar WITH (NOLOCK) 
                                    INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = ar.idMedida 
                                    WHERE ar.idArticulo = a.idArticulo 
                                    FOR JSON PATH

                                ),''[]'') as principal
				         FROM Inventario.v_Articulo a 
				         WHERE a.estado = 1 
				           AND a.idEntidad = @idEntidad
				           AND a.llevaInventario = 1 '

			IF @opcion = 1
				BEGIN 
					SET @sql = @sql + 'AND a.idArticulo = @idArticulo '
				END

			IF @opcion = 3
				BEGIN
					SET @sql = @sql + 'AND a.idSubFamilia = @idSubFamilia '
				END

			IF @opcion = 4
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
				END

			IF @opcion = 5
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE nroDocumento = @nroDocumento) '
				END

            IF @opcion = 6
                BEGIN
                    SET @sql = @sql + 'AND a.importacion = 1 
                                       AND a.stock > 0
                                       AND a.idArticulo NOT IN (
                                                                SELECT cd.idArticulo
                                                                FROM dbo.ConsolidacionInventario              ci WITH (NOLOCK)
                                                                INNER JOIN dbo.EstadoPago                     ep WITH (NOLOCK) ON ep.idEstadoPago              = ci.idEstadoDocumento
                                                                INNER JOIN dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK) ON cd.idConsolidacionInventario = ci.idConsolidacionInventario
                                                                WHERE ci.idEntidad = @idEntidad
                                                                  AND ep.codigo = ''AC''
                                                               ) '
                END 

		    SET @sql = @sql + 'ORDER BY a.idArticulo ASC '
		
		    EXEC sp_executesql @sql,@params
							       ,@idEntidad    = @idEntidad 
							       ,@idArticulo   = @idArticulo
							       ,@idSubFamilia = @idSubFamilia
							       ,@rucProveedor = @rucProveedor
							       ,@nroDocumento = @nroDocumento
            RETURN 
		END
    
    --> Serie Comprobante
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'serieComprobante'

            SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@json) WITH(idPuntoEmision INT)
               
            SELECT TOP 1 [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0) as serieComprobante  
            FROM Config.v_ConfigDocumento cd WITH (NOLOCK) 
			WHERE cd.idPuntoEmision = @idPuntoEmision
			  AND cd.codDoc = 'CIV'

            RETURN
        END 
END
