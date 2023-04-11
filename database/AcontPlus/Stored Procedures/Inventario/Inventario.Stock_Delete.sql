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
IF OBJECT_ID(N'Inventario.Stock_Delete', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Stock_Delete
GO
CREATE PROCEDURE Inventario.Stock_Delete @idUsuarioRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @codMovement AS VARCHAR(5) 
	DECLARE @idArticulo AS INT 
	DECLARE @idBodega AS INT
	DECLARE @idBodega_Destino AS INT
	DECLARE @fechaEmision AS DATETIME
	DECLARE @stock AS NUMERIC(18,2)
	DECLARE @cantidadActual AS NUMERIC(18,5)
	DECLARE @cantidad AS NUMERIC(18,5)
	DECLARE @table AS TABLE(
		 codMovement VARCHAR(5) NOT NULL 
		,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idBodega_Destino INT NULL
		,fechaEmision DATETIME NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
	)

	BEGIN TRY

		INSERT INTO @table 
		      (codMovement,idArticulo,idBodega,idBodega_Destino,fechaEmision,cantidad)
		SELECT codMovement,idArticulo,idBodega,idBodega_Destino,fechaEmision,cantidad
		FROM OPENJSON(@json) 
		WITH (codMovement VARCHAR(5) '$.codMovement'
		     ,idArticulo INT '$.idArticulo'
			 ,idBodega INT '$.idBodega'
			 ,idBodega_Destino INT '$.idBodega_Destino'
			 ,fechaEmision DATETIME '$.fechaEmision'
			 ,cantidad NUMERIC(18,5) '$.cantidad'
			 ) as dt 

		SELECT @idArticulo = idArticulo, @idBodega = idBodega, @idBodega_Destino = idBodega_Destino,@codMovement = codMovement , @fechaEmision = fechaEmision FROM @table 

		IF EXISTS (SELECT 1 FROM dbo.Articulo WHERE idArticulo = @idArticulo AND llevaInventario = 0)
			BEGIN
				SELECT '0'code,'Este articulo es un servicio' as 'message'
				RETURN 
			END

		BEGIN TRAN 
			
			--==================================================SALIDAS===================================================================
		   IF @codMovement = 'S'
				BEGIN
					SELECT TOP 1 @cantidadActual = cantidad FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

					SET @cantidadActual =  @cantidadActual + @cantidad

					UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega
					
				END 

		   --===================================================ENTRADAS==================================================================
		   IF @codMovement = 'E'
				BEGIN
					
					SELECT TOP 1 @cantidadActual = cantidad FROM Inventario.Stock WHERE idArticulo = @idArticulo AND idBodega = @idBodega 

					SET	@cantidadActual = @cantidadActual - @cantidad
					
					UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega

				END 
				
		   --===================================================TRANSFERENCIAS============================================================
		   IF @codMovement = 'T'
				BEGIN
					DECLARE @cantidadDestino AS NUMERIC(18,5)

					------------------------------Bodega Origen se restar la cantidad transferida----------------------------------------

					SELECT TOP 1 @cantidadActual = cantidad FROM Inventario.Stock WHERE idArticulo = @idArticulo AND idBodega = @idBodega

					SET @cantidadActual = @cantidadActual + @cantidad

					UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega
					
					------------------------------Bodega destino se sumara la cantidad transferida---------------------------------------

					SELECT TOP 1 @cantidadDestino = cantidad FROM Inventario.Stock WHERE idArticulo = @idArticulo AND idBodega = @idBodega_Destino

					SET @cantidadDestino = @cantidadDestino - @cantidad

					UPDATE Inventario.Stock SET cantidad = @cantidadDestino WHERE idArticulo = @idArticulo AND idBodega = @idBodega_Destino

				END 


		   SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo

		   UPDATE dbo.Articulo SET stock =  ISNULL(@stock,0) WHERE idArticulo = @idArticulo

		COMMIT TRAN
		SELECT '1'code,'Stock Actualizado Correctamente' as 'message', '' as payload
		RETURN
	END TRY 

	BEGIN CATCH
		SELECT '0'code,'Error en el proceso almacenado: '+ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH
END
