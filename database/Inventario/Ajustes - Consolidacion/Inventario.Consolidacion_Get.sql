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
            DECLARE @secuencial VARCHAR(40)
            DECLARE @tipoDocId INT 
            DECLARE @textSearch VARCHAR(50)

            SELECT @pageIndex   = pageIndex  
                  ,@pageSize    = pageSize
                  ,@ckFecha     = ckFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin    = fechaFin
                  ,@secuencial = LTRIM(RTRIM(nroSecuencial)) 
                  ,@tipoDocId     = tipoDocId
                  ,@textSearch    = LTRIM(RTRIM(textSearch)) 
            FROM OPENJSON(@json) WITH 
            (
                pageIndex   INT
               ,pageSize    INT
               ,ckFecha     BIT 
               ,fechaInicio DATETIME2
               ,fechaFin    DATETIME2
               ,nroSecuencial VARCHAR(40)
               ,tipoDocId INT 
               ,textSearch VARCHAR(50)
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
                              ,td.descripcion                                           as tipoDocumento
                              ,COUNT(*) OVER()                                          as totalRecords
			            FROM dbo.ConsolidacionInventario    ci WITH (NOLOCK)
			            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision    = ci.idPuntoEmision
			            INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario         = ci.idUsuario
			            INNER JOIN dbo.EstadoPago           ep WITH (NOLOCK) ON ep.idEstadoPago      = ci.idEstadoDocumento
                        INNER JOIN Inventario.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento   = ci.idTipoDocumento
                        INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
			            WHERE ci.idEntidad = @idEntidad '

            SET @params = '@idEntidad   INT
                          ,@fechaInicio DATETIME2
                          ,@fechaFin    DATETIME2
                          ,@pageIndex   INT
                          ,@pageSize    INT
                          ,@secuencial VARCHAR(40)
                          ,@tipoDocId INT 
                          ,@textSearch VARCHAR(50)'

            IF @tipoDocId >0
                BEGIN
                      SET @sql = @sql + ' AND ci.idTipoDocumento = @tipoDocId '
                END

            IF @secuencial IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND ci.nroDoc BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
				END 

            IF @textSearch IS NOT NULL
                BEGIN 
                    SET @sql = @sql + '   AND ci.observacion LIKE ''%''+ @textSearch + ''%'' '
                    
                END 

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + ' AND CAST(ci.fechaEmision as DATE) BETWEEN CAST(@fechaInicio as DATE) AND CAST(@fechaFin as DATE) '
                END 

            SET @sql = @sql + 'ORDER BY ci.idConsolidacionInventario DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql,@params 
								   ,@idEntidad       = @idEntidad
								   ,@fechaInicio     = @fechaInicio
								   ,@fechaFin        = @fechaFin
								   ,@pageIndex       = @pageIndex
								   ,@pageSize        = @pageSize
                                   ,@secuencial   = @secuencial
                                   ,@tipoDocId       = @tipoDocId
                                   ,@textSearch      = @textSearch

            RETURN
		END

	--> DataForm
    IF @tipo = 2
		BEGIN
            
            SET @tableNames = 'ptoEmision,bodegas,subFamilia,decimales,tiposTransaccion,tipoDocumento'

			SELECT * FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			
            SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
			
            SELECT * FROM SubFamilia     WITH(NOLOCK) WHERE idEntidad = @idEntidad
			
            SELECT * FROM Config.v_Sistema_Decimal WITH(NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'AL' 

            SELECT idTipoTransaccion,codigo,descripcion FROM Inventario.TipoTransaccion WHERE codigo IN ('A','S','E') AND estado = 1

            SELECT idTipoDocumento,codigo,descripcion FROM Inventario.TipoDocumento WHERE codigo IN ('CI','BI','EI','OR')

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
                  ,td.descripcion             as tipoDocumento
                  ,CASE td.codigo WHEN 'CI' THEN 'Ajuste'
                                  WHEN 'BI' THEN 'Salida'
                                  WHEN 'EI' THEN 'Entrada'
                   END as movimiento
			FROM dbo.ConsolidacionInventario    ci WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision    = ci.idPuntoEmision
            INNER JOIN Inventario.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento   = ci.idTipoDocumento
			INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
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
                  ,@pageIndex    = pageIndex
                  ,@pageSize     = pageSize
	        FROM OPENJSON (@json) WITH 
            (
	            opcion       INT  
	           ,idArticulo   INT 
	           ,rucProveedor VARCHAR(25) 
	           ,idSubFamilia INT 
	           ,nroDocumento VARCHAR(25)
               ,pageIndex     INT
               ,pageSize      INT
	        )

            SET @params = '@idEntidad INT,
				           @idArticulo INT,
				           @rucProveedor VARCHAR(25),
				           @idSubFamilia INT,
				           @nroDocumento VARCHAR(25),
                           @pageIndex INT,
                           @pageSize INT
                           '

	        SET @sql = 'SELECT  
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
                                ,COUNT(*) OVER() AS totalRecords
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

                     -- Crear tabla temporal para almacenar artículos sin consolidar
					CREATE TABLE #ArticulosSinConsolidar (idArticulo INT);

					-- Insertar artículos que no están consolidados en la tabla temporal
					INSERT INTO #ArticulosSinConsolidar (idArticulo)
					SELECT cd.idArticulo
					FROM dbo.ConsolidacionInventario ci WITH (NOLOCK)
					INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = ci.idEstadoDocumento
					INNER JOIN dbo.ConsolidacionInventarioDetalle cd WITH (NOLOCK) ON cd.idConsolidacionInventario = ci.idConsolidacionInventario
					WHERE ci.idEntidad = @idEntidad 
					AND ep.codigo = 'AC';
                     
					SET @sql += ' AND a.importacion = 1 
									AND a.stock > 0
									AND NOT EXISTS (
										SELECT 1 FROM #ArticulosSinConsolidar tc WHERE tc.idArticulo = a.idArticulo
									) '; 
                END 

		    SET @sql = @sql + 'ORDER BY a.idArticulo ASC '

           IF @pageIndex IS NOT NULL 
               AND @pageSize IS NOT NULL
               AND @pageSize > 0
            BEGIN
                SET @sql += '
                    OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY';
            END
            ELSE
            BEGIN
                SET @sql = REPLACE(@sql, 'SELECT', 'SELECT TOP 100');
            END

		
		    EXEC sp_executesql @sql,@params
							       ,@idEntidad    = @idEntidad 
							       ,@idArticulo   = @idArticulo
							       ,@idSubFamilia = @idSubFamilia
							       ,@rucProveedor = @rucProveedor
							       ,@nroDocumento = @nroDocumento
                                   ,@pageIndex    = @pageIndex
                                   ,@pageSize     = @pageSize;

            -- Limpiar la tabla temporal si ya no es necesaria
				DROP TABLE IF EXISTS #ArticulosSinConsolidar;
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

    --> Validacion Excel
    IF @tipo = 6
        BEGIN
            
            SET @tableNames = 'articulos,noVinculados'

            DECLARE @product VARCHAR(MAX)

            DECLARE @tbDetail TABLE(
                codigo VARCHAR(50) UNIQUE NOT NULL
               ,cantidad NUMERIC(18,5) NOT NULL
            )

            SELECT @product = product FROM OPENJSON(@json) WITH (product NVARCHAR(MAX) AS JSON)

            INSERT INTO @tbDetail
                  (codigo,cantidad)
            SELECT codigo,cantidad FROM OPENJSON(@product) WITH (codigo VARCHAR(50),cantidad NUMERIC(18,5))

            SELECT a.idArticulo
				  ,a.codigo
				  ,a.codigoAuxiliar
				  ,a.codigoBarra
				  ,a.descripcion
				  ,a.stock
				  ,a.precioCosto
				  ,a.estado
				  ,llevaInventario
				  ,ISNULL(a.medida, 'SIN MEDIDA') as medida
				  ,ISNULL(tipoIva, 'SIN IVA')     as nombreTipoIva
                  ,ISNULL(idMedida,0) idMedida
				  ,ISNULL
                   ((
                        SELECT me.idMedida
                              ,me.descripcion            as medida
                              ,ar.precioCosto
                              ,af.precioCostoFraccionado as precioUnitario
                              ,af.precioCostoFraccionado as precioCostoFraccionado
                              ,af.conversion
                        FROM ArticuloFraccionado af WITH (NOLOCK) 
                        INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
                        INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida 
                        WHERE af.idArticulo = a.idArticulo 
                        FOR JSON PATH

                   ),'[]') as fraccionado 

                  ,ISNULL
                   ((
                        SELECT me.idMedida 
                              ,me.descripcion  as medida
                              ,ar.precioCosto 
                              ,ar.precioCosto  as precioUnitario
                              ,ar.precioCosto  as precioCostoFraccionado
                              ,1               as conversion
                        FROM Articulo     ar WITH (NOLOCK) 
                        INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = ar.idMedida 
                        WHERE ar.idArticulo = a.idArticulo 
                        FOR JSON PATH

                    ),'[]') as principal 
                   ,td.cantidad
            FROM @tbDetail td 
            LEFT JOIN Inventario.v_Articulo a WITH (NOLOCK) ON a.codigo = td.codigo
            WHERE a.idEntidad = @idEntidad
              AND a.estado = 1
              AND a.llevaInventario = 1

            SELECT * FROM @tbDetail WHERE codigo NOT IN (SELECT codigo FROM Articulo WHERE idEntidad = @idEntidad AND estado = 1 AND llevaInventario = 1)

            RETURN 
        END 
END
