
USE [Acontplus]
GO
/****** Object:  StoredProcedure [Inventario].[Transaccion_Get]    Script Date: 9/15/2025 9:01:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER   PROCEDURE [Inventario].[Transaccion_Get] 
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
    DECLARE @tipo INT ,@idEntidad INT 

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
           ,@estado                      BIT
    
    --> Variables
    SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get kardex
    IF @tipo = 2
        BEGIN 
            
            SET @tableNames = 'dataArticulo,kardex'

	        SET @params = '@idArticulo     INT
				          ,@idBodega       INT
				          ,@fechaInicio    DATETIME2
				          ,@fechaFin       DATETIME2
				          ,@idEntidad      INT
				          ,@particion      INT
				          ,@codTransaccion VARCHAR(2)'

	        SET @sql = 'SELECT idTransaccion
							  ,codDoc                                       as tipoDoc
							  ,codTransaccion
							  ,idDocumento
							  ,particion
                              ,estado
							  ,nroDocumento
							  ,clienteProveedor
							  ,FORMAT(fechaRegistro, ''dd/MM/yyyy HH:mm'') as fechaEmision
							  ,usuario
							  ,CASE WHEN estado = 1 THEN ''Activo'' WHEN estado = 0 THEN ''Inactivo'' ELSE ''Transferido'' END as estadoDoc
							  ,medida 
							  ,cantidadEntrada 
				   			  ,IIF(codTransaccion = ''E'' OR codTransaccion = ''A'',precioUnitario,0) as costo          
							  ,totalEntrada  
							  ,cantidadSalida  
							  ,IIF(codTransaccion = ''S'',precioUnitario,0) as venta           
							  ,totalSalida    
							  ,IIF(estado = 1,cantidadTransaccion,0 )                                                                                     as cantidadTransaccion
							  ,SUM(IIF(estado = 1, cantidadTransaccion,0)) OVER (PARTITION BY particion ORDER BY fechaRegistro, idTransaccionDetalle ASC) as saldo
							  ,precioCosto
							  ,CAST(precioCosto * (SUM(IIF(codTransaccion = ''S'', -1, 1) * IIF(estado = 1,cantidadTransaccion,0)) OVER (PARTITION BY particion ORDER BY fechaRegistro, idTransaccionDetalle ASC))  AS DECIMAL(20,2)) as totalGeneral
						FROM v_InventarioTransaccion WITH(NOLOCK)
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
                    SET @sql = @sql + 'AND estado IN (1,2) '
                END

            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND estado IN (1,0) '
                END 

	        IF @codTransaccion IS NOT NULL
		        BEGIN
			        SET @sql = @sql + 'AND codTransaccion = @codTransaccion '
		        END

	        IF @checkBoxConsolidacion = 1
		        BEGIN
			        SET @sql = @sql + 'AND codDoc = ''CI'' '
		        END

	        IF @checkBoxFecha = 1
		        BEGIN
			        SET @sql = @sql + 'AND CAST(fechaRegistro as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
		        END

	        IF @checkBoxUltimaConsolidacion = 1
		        BEGIN
                    SELECT TOP 1 @byParticion = ConsolidacionId FROM Inventario.Stock WHERE idBodega = @byBodega AND idArticulo = @byArticulo AND estado = 1

		            SET @sql = @sql + 'AND particion = @particion '
	            END

	        SET @sql = @sql + 'ORDER BY fechaRegistro,idTransaccionDetalle ASC '

            --> Articulo 
	        SELECT ar.codigo      as codigo
		          ,ar.descripcion 
                  ,me.descripcion as medida
	        FROM Articulo ar WITH (NOLOCK)
            INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = ar.idMedida
	        WHERE idArticulo = @byArticulo 

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

    --> Get Filters Kardex 
    IF @tipo = 3
        BEGIN
            
            SET @tableNames = 'bodegas,tipoTransaccion'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idTipoTransaccion,descripcion,codigo FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE estado = 1

            RETURN 
        END 
END
