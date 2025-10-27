USE [Acontplus]
GO
/****** Object:  StoredProcedure [Inventario].[Transaccion_Report]    Script Date: 9/15/2025 9:02:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER   PROCEDURE [Inventario].[Transaccion_Report] 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150)

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

    --> Filerts
	DECLARE @checkBoxFecha               BIT
	       ,@checkBoxUltimaConsolidacion BIT
	       ,@checkBoxConsolidacion       BIT
	       ,@codTransaccion              VARCHAR(2)
	       ,@byBodega                    INT
	       ,@byParticion                 INT
	       ,@byArticulo                  INT
	       ,@fechaInicio                 DATETIME2
	       ,@fechaFin                    DATETIME2
	       ,@stock                       DECIMAL(15,5) = 0
           ,@estado                      BIT
           ,@fechaInicioInventario       DATETIME2
	       ,@fechaFinInventario          DATETIME2
    
    --> Variables
    SELECT TOP 1 @idEntidad  = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Report kardex
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'encabezadoDs,detalleDs'

	        SET @params = '@idArticulo     INT
				          ,@idBodega       INT
				          ,@fechaInicio    DATETIME2
				          ,@fechaFin       DATETIME2
				          ,@idEntidad      INT
				          ,@particion      INT
				          ,@codTransaccion VARCHAR(2)'

	        SET @sql = 'SELECT vt.idTransaccion
                              ,vt.idTransaccionDetalle
							  ,vt.codDoc                                       as tipoDoc
							  ,vt.codTransaccion
							  ,vt.idDocumento
							  ,vt.particion
                              ,vt.estado as estadoDoc
							  ,vt.nroDocumento
							  ,CASE WHEN vt.idTransaccionOriginal > 0 THEN vt.documento + '' '' + td.codigo + '': '' + at.serieComprobante
                                                                      ELSE vt.clienteProveedor
                               END                                            as clienteProveedor
							  ,FORMAT(vt.fechaRegistro, ''dd/MM/yyyy HH:mm'') as fechaEmision
							  ,vt.usuario
							  ,CASE WHEN vt.estado = 1 THEN ''Activo'' WHEN vt.estado = 0 THEN ''Inactivo'' ELSE ''Transferido'' END as estado
							  ,vt.medida 
							  ,vt.cantidadEntrada 
				   			  ,IIF(vt.codTransaccion = ''E'' OR vt.codTransaccion = ''A'',precioUnitario,0) as costo          
							  ,vt.totalEntrada  
							  ,vt.cantidadSalida  
							  ,IIF(vt.codTransaccion = ''S'',vt.precioUnitario,0) as venta           
							  ,vt.totalSalida 
                              ,vt.cantidadTransaccion
							  ,vt.saldo
							  ,vt.precioCosto
							  ,CAST(vt.precioCosto * vt.saldo as numeric(18,2)) as totalGeneral
						FROM v_InventarioTransaccion       vt
                        LEFT JOIN Inventario.Transaccion   at ON at.idTransaccion   = vt.idTransaccionOriginal
                        LEFT JOIN Inventario.TipoDocumento td ON td.idTipoDocumento = at.idTipoDocumento
						WHERE idArticulo = @idArticulo
						  AND idBodega   = @idBodega '

	        SELECT @checkBoxConsolidacion       = checkBoxConsolidacion
		          ,@checkBoxFecha               = checkBoxFecha
		          ,@checkBoxUltimaConsolidacion = checkBoxUltimaConsolidacion
		          ,@byArticulo                  = byArticulo
		          ,@codTransaccion              = movement
		          ,@byBodega                    = byBodega
		          ,@fechaFin                    = fechaFin
		          ,@fechaInicio                 = fechaInicio
                  ,@estado                      = estado  
	        FROM OPENJSON(@json) WITH 
            (
		         checkBoxFecha               BIT 
	            ,checkBoxUltimaConsolidacion BIT 
	            ,checkBoxConsolidacion       BIT 
	            ,movement                    VARCHAR(2) 
	            ,byBodega                    INT 
	            ,byArticulo                  INT 
	            ,fechaInicio                 DATETIME2 
	            ,fechaFin                    DATETIME2 
                ,estado                      BIT
	        )

           IF @estado = 0
                BEGIN
                    SET @sql = @sql + 'AND vt.estado IN (1,2) '
                END

            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND vt.estado IN (1,0) '
                END 

	        IF @codTransaccion IS NOT NULL
		        BEGIN
			        SET @sql = @sql + 'AND vt.codTransaccion = @codTransaccion '
		        END

	        IF @checkBoxConsolidacion = 1
		        BEGIN
			        SET @sql = @sql + 'AND vt.codDoc = ''CI'' '
		        END

	         IF @checkBoxFecha = 1
		        BEGIN
			        SET @sql = @sql + 'AND CAST(vt.fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
		        END

	        IF @checkBoxUltimaConsolidacion = 1
		        BEGIN
                    SELECT TOP 1 @byParticion = td.idTransaccion
                    FROM Inventario.Stock                    st 
                    INNER JOIN Inventario.TransaccionDetalle td ON td.idTransaccionDetalle = st.idTransaccionDetalle
                    INNER JOIN Inventario.Transaccion        tr ON tr.idTransaccion        = td.idTransaccion
                    WHERE st.idArticulo = @byArticulo
                      AND st.idBodega = @byBodega
                      AND st.estado = 1

		            SET @sql = @sql + 'AND vt.particion = @particion '
	            END

	        SET @sql = @sql + 'ORDER BY vt.fechaRegistro,vt.idTransaccionDetalle ASC '

            --> headerDs 
	        SELECT en.ruc
                  ,en.razonSocial
                  ,es.nombreComercial
                  ,bo.descripcion                                                                            as bodega
                  ,ar.codigo
                  ,ar.descripcion                                                                            as articulo
                  ,'Kardex'                                                                                  as tituloReporte
                  ,@usuario                                                                                  as usuario
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy HH:mm') + ' a ' +  FORMAT(@fechaFin, 'dd/MM/yyyy HH:mm') as filtroFecha
                  ,CAST(@stock as numeric(18,2))                                                             as stockAnterior
                  ,me.descripcion                                                                            as medida
            FROM Inventario.Stock          st WITH (NOLOCK)
            INNER JOIN dbo.Bodega          bo WITH (NOLOCK) ON bo.idBodega   = st.idBodega
            INNER JOIN dbo.Articulo        ar WITH (NOLOCK) ON ar.idArticulo = st.idArticulo
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab   = bo.codEstab
            INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad  = es.idEntidad
            INNER JOIN dbo.Medida          me WITH (NOLOCK) ON me.idMedida   = ar.idMedida
            WHERE st.idBodega = @byBodega
              AND st.idArticulo = @byArticulo

            --> Kardex
	         EXEC sp_executesql @sql ,@params
		                            ,@idArticulo     = @byArticulo
		                            ,@idEntidad      = @idEntidad
		                            ,@idBodega       = @byBodega
		                            ,@fechaInicio    = @fechaInicio
		                            ,@fechaFin       = @fechaFin
		                            ,@particion      = @byParticion
		                            ,@codTransaccion = @codTransaccion

            RETURN 
        END 
END
