USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[Articulo_Update_Stock]    Script Date: 11/28/2022 12:22:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
-- Test : exec Inventario.Stock_Update_Salida 38, '[{"cantidad":5,"idArticulo":1,"fechaEmision":"2022-05-05T13:52:17.833","idBodega":1}]'
IF OBJECT_ID(N'Inventario.Stock_Update_Salida', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Stock_Update_Salida
GO
CREATE PROCEDURE Inventario.Stock_Update_Salida @idUsuarioRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idArticulo AS INT 
	DECLARE @idEntidad AS INT 
	DECLARE @idBodega AS INT

	DECLARE @stockCantidad BIT 
	DECLARE @ventaStockCero BIT
	DECLARE @stockMinimo BIT
    DECLARE @titleSms VARCHAR(100)
	DECLARE @porcentaje DECIMAL(15,5)
	DECLARE @type INT 
	DECLARE @messge VARCHAR(300)

	DECLARE @fechaEmision AS DATETIME
	DECLARE @stock DECIMAL(15,5)
	DECLARE @cantidadActual AS NUMERIC(18,5)
	DECLARE @cantidad AS NUMERIC(18,5)
	DECLARE @table AS TABLE(
		 idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,fechaEmision DATETIME NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
	)
	DECLARE @ajustes AS TABLE (
	     idAjuste INT NOT NULL
	    ,fechaEmision DATETIME NOT NULL
	)


	DECLARE @articulos AS VARCHAR(MAX)
	DECLARE @payload AS VARCHAR(MAX)

	BEGIN TRY

		INSERT INTO @table (idArticulo,idBodega,fechaEmision,cantidad)
					 SELECT idArticulo,idBodega,fechaEmision,cantidad
					 FROM OPENJSON(@json) 
		WITH (idArticulo INT '$.idArticulo',idBodega INT '$.idBodega' ,fechaEmision DATETIME '$.fechaEmision',cantidad NUMERIC(18,5) '$.cantidad') as dt 

		SELECT @idArticulo = idArticulo, @idBodega = idBodega, @fechaEmision = fechaEmision, @cantidad= cantidad FROM @table 

		SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		--|| Mostrar notificacion de artículos sin stock || --
		SELECT TOP 1 @stockCantidad = estado FROM Config.EntidadNotificacion  WITH (NOLOCK) WHERE codNotificacion = 'MNS' AND idEntidad = @idEntidad AND estado = 1

		--|| No permitir la venta de artículos sin stock || --
		SELECT TOP 1 @ventaStockCero = estado FROM Config.EntidadNotificacion WITH (NOLOCK) WHERE codNotificacion = 'NPS' AND idEntidad = @idEntidad AND estado = 1

		-- ||Mostrar notificacion de artículos con stock mínimo ||--
		SELECT TOP 1 @stockMinimo    = estado FROM Config.EntidadNotificacion WITH (NOLOCK) WHERE codNotificacion = 'MNM' AND idEntidad = @idEntidad AND estado = 1

		SELECT TOP 1 @cantidadActual = ISNULL(stock,0), @porcentaje = ti.porcentaje FROM Articulo a WITH (NOLOCK) INNER JOIN dbo.TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = a.idTipoIva WHERE idArticulo = @idArticulo

		--SELECT TOP 1 @cantidadActual = cantidad FROM Inventario.Stock WITH (NOLOCK) WHERE idBodega = @idBodega AND idArticulo = @idArticulo
		

		IF @stockCantidad = 1 AND @cantidadActual >= 0
			BEGIN
				SET @type = 1

				IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo AND stock <= 0 AND llevaInventario = 1)
					BEGIN
						SELECT @messge = 'EL ARTICULO: '+'<b>'+descripcion+'</b>'+' TIENE UN STOCK '+CAST(stock AS nvarchar) FROM Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo
					END 

				IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo AND stock <= stockMinimo AND llevaInventario = 1)
					BEGIN
						SELECT @messge = 'EL ARTICULO: '+'<b>'+descripcion+'</b>'+' TIENE UN STOCK '+CAST(stock AS nvarchar) FROM Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo
					END 
			END 

		--======================================================Validaciones=======================================================================
		IF EXISTS (SELECT 1 FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo AND llevaInventario = 0)
			BEGIN
				SELECT '0'code,'Este articulo es un servicio' as 'message'
				RETURN 
			END

		IF @ventaStockCero = 1 AND @cantidadActual <= 0 
			BEGIN
				SELECT '0'code,'EL ARTICULO: '+'<b>'+descripcion+'</b>'+' TIENE UN STOCK DE '+CAST(stock AS nvarchar) as 'message','ARTICULO SIN STOCK' as 'titleSms'
				FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo
				RETURN 
			END 

		--==================================================SALIDAS===================================================================
		  

		INSERT INTO @ajustes (idAjuste,fechaEmision)
		SELECT tt.idTransaccion, MAX(tt.fechaRegistro) 
		FROM Inventario.Transaccion tt WITH (NOLOCK) 
		INNER JOIN Inventario.TipoTransaccion ti WITH (NOLOCK) ON ti.idTipoTransaccion = tt.idTipoTransaccion 
		WHERE ti.codigo = 'A' AND tt.idArticulo = @idArticulo AND tt.idBodega = @idBodega AND tt.estado = 1  
		GROUP BY tt.idTransaccion

		IF (SELECT COUNT(*) FROM @ajustes) > 0 
			BEGIN
				IF (SELECT COUNT(*) FROM @ajustes WHERE fechaEmision >= @fechaEmision) > 0 
					BEGIN 
						SET @cantidadActual = @cantidadActual - @cantidad
					END 
			END 

		IF (SELECT COUNT(*) FROM @ajustes) = 0  
			BEGIN 
				SET @cantidadActual = @cantidadActual - @cantidad
			END

		BEGIN TRAN 
			

				IF @ventaStockCero = 1 AND @cantidadActual <= 0 
					BEGIN
						SELECT '0'code,'Tu configuración no te permite vender articulos en stock cero' as 'message'
						ROLLBACK TRAN; 
						RETURN
					END 

				UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega

				SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

				IF @ventaStockCero = 1 AND @stock <= 0 
					BEGIN
						SELECT '0'code,'Tu configuración no te permite vender articulos en stock cero' as 'message'
						ROLLBACK TRAN; 
						RETURN
					END 

				UPDATE dbo.Articulo SET stock = @cantidadActual WHERE idArticulo = @idArticulo

				SET @articulos = (SELECT 
				                     idArticulo = ar.idArticulo
									,idMedida = ISNULL(ar.idMedida,0)
									,idTipoIva = ti.idTipoIva
									,codigoAuxiliar = ISNULL(ar.codigoAuxiliar, 'S/N')
									,descripcion = ar.descripcion
									,valorIce = ISNULL(ar.valorIce,0)
									,llevaInventario = ar.llevaInventario
									,datosAdicionales = ISNULL(ar.datosAdicionales, 0) 
									,productoFraccionable = ar.productoFraccionable
									,precioCosto = ar.precioCosto
									,nombreTipoIva = ti.descripcion
									,tarifa = ti.porcentaje
									,codigoPorcentaje =  CAST(ti.codigoPorcentaje as varchar)
									,codigoArticulo = IIF(ti.porcentaje > 0,'*','')+ar.codigo
									,stock = ar.stock 
								FROM dbo.Articulo      ar WITH (NOLOCK) 
								INNER JOIN dbo.TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = ar.idTipoIva
								LEFT JOIN dbo.Medida  me WITH (NOLOCK) ON me.idMedida  = ar.idMedida
								WHERE ar.idArticulo = @idArticulo FOR JSON PATH )
				

				SET @payload = (SELECT  
				                     'code'     = CASE WHEN @type = 1 THEN '2' ELSE '1' END
									,'message'  = ISNULL(@messge,'')
									,'titleSms' = ISNULL(@titleSms,'')
									,articulo   = @articulos
							   FOR JSON PATH)
		COMMIT TRAN
		SELECT '1'code,'Stock Actualizado Correctamente' as 'message',@payload as payload
		RETURN
	END TRY 

	BEGIN CATCH
		SELECT '0'code,'Error en el proceso almacenado: '+ERROR_MESSAGE() as 'message'
		ROLLBACK TRAN;
		RETURN 
	END CATCH
END
